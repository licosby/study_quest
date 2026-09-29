import pdfjsLib from "pdfjs-dist";

export async function extractAndChunkPDF(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + "\n\n";
  }

  // Clean weird spacing
  const cleaned = fullText
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Split by common textbook markers
  let chunks = cleaned.split(
    /(?:Chapter\s+\d+|CHAPTER\s+\d+|Section\s+\d+|SECTION\s+\d+|Topic\s+\d+|TOPIC\s+\d+)/g
  );

  // If splitting by headings failed, fall back to paragraph splitting
  if (chunks.length <= 1) {
    chunks = cleaned.split(/\n\n+/g);
  }

  // Remove tiny chunks
  chunks = chunks
    .map((c) => c.trim())
    .filter((c) => c.length > 50);

  // Hard limit chunk size
  const MAX_CHUNK_SIZE = 1500;
  const finalChunks: string[] = [];

  for (const chunk of chunks) {
    if (chunk.length <= MAX_CHUNK_SIZE) {
      finalChunks.push(chunk);
    } else {
      let start = 0;
      while (start < chunk.length) {
        finalChunks.push(chunk.slice(start, start + MAX_CHUNK_SIZE));
        start += MAX_CHUNK_SIZE;
      }
    }
  }

  return finalChunks;
}
