import React, { useState, useCallback } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';

interface SignaturePreviewProps {
  firstName: string;
  lastName: string;
  onSignatureSelect: (signatureData: SignatureData) => void;
  onCancel: () => void;
}

interface SignatureData {
  imageUrl: string;
  imageBuffer: ArrayBuffer;
  metadata: {
    firstName: string;
    lastName: string;
    provider: string;
    typographyKey: string;
    usedStyle: number;
    generatedAt: string;
  };
}

export function SignaturePreview({ firstName, lastName, onSignatureSelect, onCancel }: SignaturePreviewProps) {
  const [currentSignature, setCurrentSignature] = useState<SignatureData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSignature = useCallback(async () => {
    if (isGenerating) return; // Prevent duplicate requests
    
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error generando la firma');
      }

      const data = await response.json();
      setCurrentSignature(data);
    } catch (error) {
      console.error('Error generating signature:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsGenerating(false);
    }
  }, [firstName, lastName, isGenerating]);

  // Debounce the generate function to prevent rapid clicks
  const debouncedGenerate = useDebounce(generateSignature, 500);

  React.useEffect(() => {
    generateSignature();
  }, [firstName, lastName]);

  const handleSelectSignature = useCallback(() => {
    if (currentSignature && !isGenerating) {
      onSignatureSelect(currentSignature);
    }
  }, [currentSignature, isGenerating, onSignatureSelect]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Vista Previa de la Firma
            </h2>
            <p className="text-gray-600">
              Para: <span className="font-semibold">{firstName} {lastName}</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-gray-600">Generando firma manuscrita...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={debouncedGenerate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : currentSignature ? (
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border-2 border-dashed border-gray-200">
                  <img
                    src={currentSignature.imageUrl}
                    alt="Firma generada"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '120px' }}
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Estilo: {currentSignature.metadata.typographyKey} • 
                  Proveedor: {currentSignature.metadata.provider}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={debouncedGenerate}
              disabled={isGenerating}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generando...' : 'Generar Nueva Firma'}
            </button>

            <button
              onClick={handleSelectSignature}
              disabled={!currentSignature || isGenerating}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5 mr-2" />
              Usar Esta Firma
            </button>

            <button
              onClick={onCancel}
              disabled={isGenerating}
              className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}