import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(file, onProgress) {
  const worker = await createWorker('spa+eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    }
  });

  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();

  return text;
}
