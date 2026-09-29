import { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.version}/pdf.worker.min.js`;

interface UploadChapterModalProps {
  onChapterAdded?: (chapter: { id: number; title: string; content: string }) => void;
}

export default function UploadChapterModal({ onChapterAdded }: UploadChapterModalProps) {
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "text/plain") {
      const text = await file.text();
      setFileText(text);
      return;
    }

    if (file.type === "application/pdf") {
      const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
      let extracted = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extracted += content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ") + "\n";
      }

      setFileText(extracted);
      return;
    }

    alert("Unsupported file type. Use PDF or TXT.");
  }
