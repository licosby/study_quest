import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// 1. Polyfill Symbol.asyncIterator on ReadableStream for Safari / WebKit / iOS
if (typeof ReadableStream !== 'undefined' && !(Symbol.asyncIterator in ReadableStream.prototype)) {
  (ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  };
}

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

// Convert ArrayBuffer to Base64 safely
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Fallback tier: Server-side PDF extraction
async function extractViaServer(arrayBuffer: ArrayBuffer, filename: string): Promise<string> {
  const base64Data = arrayBufferToBase64(arrayBuffer);
  const response = await fetch('/api/pdf/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Data, filename }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    throw new Error(errJson?.error || `Server extraction returned ${response.status}`);
  }

  const result = await response.json();
  if (!result.text || !result.text.trim()) {
    throw new Error('Server returned empty PDF text');
  }

  return result.text;
}

// Fallback tier 3: Client-side binary text stream extractor
function extractRawTextStreams(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  let raw = '';
  // Decode ASCII strings from buffer
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b >= 32 && b <= 126) {
      raw += String.fromCharCode(b);
    } else if (b === 10 || b === 13) {
      raw += '\n';
    }
  }

  const extractedPieces: string[] = [];
  // Match Tj and TJ text operators
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(raw)) !== null) {
    if (match[1] && match[1].length > 1) {
      extractedPieces.push(match[1]);
    }
  }

  const arrayTjRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(raw)) !== null) {
    const inner = match[1];
    const subParts = inner.match(/\(([^)]+)\)/g);
    if (subParts) {
      const line = subParts.map((s) => s.slice(1, -1)).join('');
      if (line.length > 1) extractedPieces.push(line);
    }
  }

  return extractedPieces.join(' ').replace(/\s+/g, ' ').trim();
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Tier 1: Try local pdfjsLib with stream disabled to avoid WebKit readableStream asyncIterator bug
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      disableStream: true,
      disableRange: true,
      disableAutoFetch: true,
      useWorkerFetch: false,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');

      if (pageStrings.trim()) {
        fullText += `--- Page ${i} ---\n${pageStrings}\n\n`;
      }
    }

    if (fullText.trim()) {
      return fullText.trim();
    }
  } catch (clientErr: any) {
    console.warn('Client-side PDF extraction error (attempting server fallback):', clientErr);
  }

  // Tier 2: Call backend /api/pdf/extract (Node.js legacy build without Safari WebKit limitations)
  try {
    const serverText = await extractViaServer(arrayBuffer, file.name);
    if (serverText.trim()) {
      return serverText.trim();
    }
  } catch (serverErr: any) {
    console.warn('Server-side PDF extraction error (attempting raw text stream fallback):', serverErr);
  }

  // Tier 3: Binary string stream extraction
  try {
    const rawText = extractRawTextStreams(arrayBuffer);
    if (rawText && rawText.length > 50) {
      return rawText;
    }
  } catch (rawErr: any) {
    console.warn('Raw text stream extraction failed:', rawErr);
  }

  throw new Error(
    'Unable to read text from this PDF. The document may be an image-only scanned PDF or password protected. Please try saving it as a selectable-text PDF or uploading a .txt file.'
  );
}
