import React from 'react';
import { AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ProcessingState } from '../../types';

interface ProcessingStepProps {
  processing: ProcessingState;
  onRetry: () => void;
}

export function ProcessingStep({ processing, onRetry }: ProcessingStepProps) {
  return (
    <div className="p-8 text-center">
      <div className="mb-6">
        {processing.status === 'loading' && (
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
        )}
        {processing.status === 'error' && (
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        )}
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {processing.status === 'loading' ? 'Procesando PDF...' : 'Error'}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {processing.message}
      </p>

      {processing.status === 'error' && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}