import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { SignatureData } from '../../types';

interface CompleteStepProps {
  file: File;
  selectedSignature: SignatureData | null;
  onDownload: () => void;
  onStartOver: () => void;
}

export function CompleteStep({ file, selectedSignature, onDownload, onStartOver }: CompleteStepProps) {
  return (
    <div className="p-8 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        ¡PDF Firmado Exitosamente!
      </h2>
      <p className="text-gray-600 mb-8">
        Tu documento ha sido firmado automáticamente y está listo para descargar.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onDownload}
          className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
        >
          <Download className="w-6 h-6 mr-3" />
          Descargar PDF Firmado
        </button>

        <button
          onClick={onStartOver}
          className="inline-flex items-center px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Firmar Otro Documento
        </button>
      </div>

      {selectedSignature && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Firma utilizada:</p>
          <img
            src={selectedSignature.imageUrl}
            alt="Firma utilizada"
            className="max-w-[200px] max-h-[60px] mx-auto"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}