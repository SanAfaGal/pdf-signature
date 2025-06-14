import { useCallback } from 'react';
import { SignatureData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function usePdfProcessor() {
  const processWithSignature = useCallback(async (
    file: File,
    signatureData: SignatureData,
    onProgress: (message: string) => void,
    onSuccess: (downloadUrl: string) => void,
    onError: (error: string) => void
  ) => {
    try {
      onProgress('Procesando PDF con firma...');

      const formDataToSend = new FormData();
      formDataToSend.append('pdf', file);
      formDataToSend.append('signatureImageUrl', signatureData.imageUrl);
      formDataToSend.append('positionX', '200');
      formDataToSend.append('positionY', '375');
      formDataToSend.append('page', '1');
      formDataToSend.append('firstName', signatureData.metadata.firstName);
      formDataToSend.append('lastName', signatureData.metadata.lastName);

      const response = await fetch(`${API_BASE_URL}/process-pdf-with-position`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error procesando el PDF');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      onSuccess(downloadUrl);

    } catch (error) {
      console.error('Error processing PDF:', error);
      onError(error instanceof Error ? error.message : 'Error procesando el PDF');
    }
  }, []);

  return { processWithSignature };
}