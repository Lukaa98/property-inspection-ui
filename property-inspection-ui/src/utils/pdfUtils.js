import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateInspectionPDF(formData) {
  const { address, inspectionType, date, email } = formData;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  const text = [
    'Property Inspection Request',
    '',
    `Address: ${address}`,
    `Inspection Type: ${inspectionType}`,
    `Date Needed: ${date}`,
    `Requestor Email: ${email}`,
  ].join('\n');

  page.drawText(text, {
    x: 50,
    y: 350,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 20,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return url;
}
