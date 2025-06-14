import React from 'react';
import { Upload, User, Edit3, FileText, Download } from 'lucide-react';
import { AppStep } from '../../types';

interface ProgressStepsProps {
  currentStep: AppStep;
}

const steps = [
  { step: 'upload' as AppStep, label: 'Subir PDF', icon: Upload },
  { step: 'form' as AppStep, label: 'Datos', icon: User },
  { step: 'signature' as AppStep, label: 'Firma', icon: Edit3 },
  { step: 'processing' as AppStep, label: 'Procesar', icon: FileText },
  { step: 'complete' as AppStep, label: 'Descargar', icon: Download }
];

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {steps.map(({ step, label, icon: Icon }, index) => {
          const isActive = currentStep === step;
          const isCompleted = steps.findIndex(s => s.step === currentStep) > index;
          
          return (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                isActive ? 'bg-blue-600 border-blue-600 text-white' :
                isCompleted ? 'bg-green-600 border-green-600 text-white' :
                'bg-gray-200 border-gray-300 text-gray-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-blue-600' :
                isCompleted ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}