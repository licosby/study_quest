import { Router, Request, Response } from 'express';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const router = Router();

router.post('/extract', async (req: Request, res: Response) => {
  try {
    const { base64Data, filename } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'No PDF data provided' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      disableFontFace: true,
      useSystemFonts: true,
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

    return res.json({
      success: true,
      text: fullText.trim(),
      pages: numPages,
      filename: filename || 'document.pdf',
    });
  } catch (err: any) {
    console.error('Server PDF extraction failed:', err);
    return res.status(500).json({
      error: 'Failed to extract PDF text on server',
      details: err?.message || 'Unknown PDF parsing error',
    });
  }
});

export default router;
