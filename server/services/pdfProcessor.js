import { insertSignatureIntoPdf } from './pdfModifier.js';

export async function processSignedPDF(pdfBuffer, originalFilename, firstName, lastName, signatureOptions = null) {
  try {
    console.log('Starting PDF processing...');
    
    // Validate inputs
    if (!firstName || !lastName) {
      return {
        success: false,
        error: 'Nombre y apellido son requeridos'
      };
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      return {
        success: false,
        error: 'Nombre y apellido no pueden estar vacíos'
      };
    }

    console.log(`Processing PDF for: ${trimmedFirstName} ${trimmedLastName}`);
    
    let signatureImageBuffer;
    let position = null;

    if (signatureOptions && signatureOptions.imageUrl) {
      // Download signature image from URL
      console.log('Downloading signature image...');
      const imageResponse = await fetch(signatureOptions.imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download signature image: ${imageResponse.status}`);
      }
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      signatureImageBuffer = Buffer.from(imageArrayBuffer);
      position = signatureOptions.position;
    } else {
      return {
        success: false,
        error: 'Signature image URL is required'
      };
    }
    
    // Insert signature into PDF
    console.log('Inserting signature into PDF...');
    const modifiedPdfBuffer = await insertSignatureIntoPdf(pdfBuffer, signatureImageBuffer, position);
    
    return {
      success: true,
      pdfBuffer: modifiedPdfBuffer,
      filename: originalFilename,
      metadata: {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        fullName: `${trimmedFirstName} ${trimmedLastName}`,
        signatureGenerated: true,
        processedAt: new Date().toISOString(),
        position
      }
    };
    
  } catch (error) {
    console.error('Error in processSignedPDF:', error);
    return {
      success: false,
      error: `Error procesando el PDF: ${error.message}`,
      debug: {
        errorStack: error.stack,
        errorName: error.name
      }
    };
  }
}