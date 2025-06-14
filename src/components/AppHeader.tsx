import React from 'react';
import { FileText } from 'lucide-react';

export function AppHeader() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
        <FileText className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Firmador de PDFs
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Sube tu PDF, genera una firma manuscrita personalizada y se insertará automáticamente
      </p>
    </div>
  );
}