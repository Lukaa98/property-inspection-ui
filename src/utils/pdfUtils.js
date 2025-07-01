import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateInspectionPDF(formData, mapCenter) {
  const { name, address, inspectionType, date, email } = formData;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const lines = [
    'Property Inspection Request',
    `Name: ${name}`,
    `Address: ${address}`,
    `Inspection Type: ${inspectionType}`,
    `Date Needed: ${date}`,
    `Requestor Email: ${email}`,
  ];

  // Draw text lines starting from top (y = 750), line height = 20
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: 50,
      y: 750 - index * 20,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
  });

  // Draw static map image below text if location is provided
  if (mapCenter) {
    const { lat, lng } = mapCenter;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=500x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

    try {
      const imageBytes = await fetch(staticMapUrl).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedPng(imageBytes);

      page.drawImage(image, {
        x: 50,
        y: 750 - lines.length * 20 - 40 - 300, // y: topText - totalTextHeight - gap - imageHeight
        width: 500,
        height: 300,
      });
    } catch (err) {
      console.error('Failed to fetch or embed map image:', err);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
}
