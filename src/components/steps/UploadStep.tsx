import React from 'react';
import { Upload } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface UploadStepProps {
  onFileSelect: (file: File) => void;
}

export function UploadStep({ onFileSelect }: UploadStepProps) {
  const debouncedFileSelect = useDebounce(onFileSelect, 300);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      debouncedFileSelect(selectedFile);
    } else {
      alert('Por favor selecciona un archivo PDF válido');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      debouncedFileSelect(droppedFile);
    } else {
      alert('Por favor arrastra un archivo PDF válido');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Subir Documento PDF
      </h2>
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-700">
              Arrastra tu PDF aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Máximo 10MB • Solo archivos PDF
            </p>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5 mr-2" />
            Seleccionar Archivo
          </label>
        </div>
      </div>
    </div>
  );
}