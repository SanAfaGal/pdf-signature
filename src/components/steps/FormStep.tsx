import React from 'react';
import { User } from 'lucide-react';
import { FormData } from '../../types';

interface FormStepProps {
  file: File;
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onStartOver: () => void;
  isProcessing: boolean;
}

export function FormStep({ 
  file, 
  formData, 
  onInputChange, 
  onSubmit, 
  onStartOver,
  isProcessing 
}: FormStepProps) {
  const isFormValid = () => {
    return formData.firstName.trim() && formData.lastName.trim();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Información para la Firma
        </h2>
        <div className="text-sm text-gray-600">
          Archivo: <span className="font-medium">{file.name}</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Primer Nombre *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              placeholder="Ej: Juan"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={isProcessing}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Apellido(s) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              placeholder="Ej: Pérez García"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> La firma se generará usando el nombre y apellido que ingreses aquí 
          y se insertará automáticamente en el documento.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onStartOver}
          disabled={isProcessing}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          Cambiar archivo
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid() || isProcessing}
          className={`px-6 py-3 rounded-lg transition-colors ${
            isFormValid() && !isProcessing
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? 'Procesando...' : 'Generar Firma'}
        </button>
      </div>
    </div>
  );
}