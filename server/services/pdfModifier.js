import { PDFDocument, rgb } from 'pdf-lib';

export async function insertSignatureIntoPdf(pdfBuffer, signatureImageBuffer, position = null) {
  try {
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    if (pages.length === 0) {
      throw new Error('PDF has no pages');
    }
    
    // Get the target page (default to first page)
    const pageIndex = (position?.page || 1) - 1;
    const targetPage = pages[Math.min(pageIndex, pages.length - 1)];
    const { width, height } = targetPage.getSize();
    
    // Embed the signature image
    const signatureImage = await pdfDoc.embedPng(signatureImageBuffer);
    
    // Calculate signature dimensions (scale to reasonable size)
    const maxWidth = width * 0.25; // Max 25% of page width
    const maxHeight = height * 0.1; // Max 10% of page height
    const signatureImageDims = signatureImage.scaleToFit(maxWidth, maxHeight);
    
    // Use fixed coordinates (200, 400) - convert to PDF coordinate system
    let signatureX = 200;
    let signatureY = height - 400; // PDF coordinates are from bottom-left, so we subtract from height
    
    // Ensure signature stays within page bounds
    signatureX = Math.max(0, Math.min(signatureX, width - signatureImageDims.width));
    signatureY = Math.max(0, Math.min(signatureY, height - signatureImageDims.height));
    
    // Draw the signature on the page
    targetPage.drawImage(signatureImage, {
      x: signatureX,
      y: signatureY,
      width: signatureImageDims.width,
      height: signatureImageDims.height,
    });
    
    // Save the PDF
    const modifiedPdfBytes = await pdfDoc.save();
    return Buffer.from(modifiedPdfBytes);
    
  } catch (error) {
    throw new Error(`Failed to insert signature into PDF: ${error.message}`);
  }
}