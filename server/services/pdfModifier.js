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
    
    // Use coordinates from position parameter, environment variables, or defaults
    // Environment variables: SIGNATURE_X, SIGNATURE_Y (in pixels from top-left)
    // PDF coordinates are from bottom-left, so we need to convert
    const defaultX = parseFloat(process.env.SIGNATURE_X) || 200;
    const defaultY = parseFloat(process.env.SIGNATURE_Y) || 400;
    
    // Get Y coordinate (from top) - either from position, env var, or default
    const yFromTop = position?.y ?? defaultY;
    
    // Convert to PDF coordinates (from bottom-left)
    // Subtract image height so the top of the image is at yFromTop pixels from the top
    let signatureX = position?.x ?? defaultX;
    let signatureY = height - yFromTop - signatureImageDims.height;
    
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