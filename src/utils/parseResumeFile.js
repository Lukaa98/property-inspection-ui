import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

export async function parseResumeFile(file) {
  const text =
    file.type === 'application/pdf'
      ? await extractPdfText(file)
      : await file.text();

  return textToBlocks(text);
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    disableWorker: true, // <-- THIS is enough
  });

  const pdf = await loadingTask.promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(' ');

    fullText += pageText + '\n';
  }

  return fullText;
}

function textToBlocks(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: String(index),
      text: line,
      type: guessBlockType(line),
    }));
}

function guessBlockType(text) {
  if (text === text.toUpperCase() && text.length < 40) {
    return 'section_title';
  }

  if (/^[-•*]/.test(text)) {
    return 'experience_bullet';
  }

  if (/\d{4}/.test(text) && /–|-/.test(text)) {
    return 'experience_header';
  }

  return 'unknown';
}
