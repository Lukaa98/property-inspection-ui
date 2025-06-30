import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateInspectionPDF(formData, mapCenter) {
  const { address, inspectionType, date, email } = formData;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // width, height

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  let currentY = 750; // top margin

  const lineHeight = 20;

  const lines = [
    'Property Inspection Request',
    '',
    `Address: ${address}`,
    `Inspection Type: ${inspectionType}`,
    `Date Needed: ${date}`,
    `Requestor Email: ${email}`,
  ];

  for (const line of lines) {
    page.drawText(line, {
      x: 50,
      y: currentY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  // Static Map
  if (mapCenter) {
    const { lat, lng } = mapCenter;

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=500x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

    try {
      const imageBytes = await fetch(staticMapUrl).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedPng(imageBytes);

      page.drawImage(image, {
        x: 50,
        y: 75, // Lower on the page so it doesn't overlap text
        width: 500,
        height: 300,
      });
    } catch (err) {
      console.error('Failed to fetch or embed map image:', err);
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
