import React from 'react';
import { Upload, User, Edit3, FileText, Download } from 'lucide-react';
import { AppStep } from '../../types';

interface ProgressStepsProps {
  currentStep: AppStep;
}

const steps = [
  { step: 'upload' as AppStep, label: 'Subir', shortLabel: 'PDF', icon: Upload },
  { step: 'form' as AppStep, label: 'Datos', shortLabel: 'Info', icon: User },
  { step: 'signature' as AppStep, label: 'Firma', shortLabel: 'Firma', icon: Edit3 },
  { step: 'processing' as AppStep, label: 'Procesar', shortLabel: 'Proc', icon: FileText },
  { step: 'complete' as AppStep, label: 'Descargar', shortLabel: 'Listo', icon: Download }
];

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const currentStepIndex = steps.findIndex(s => s.step === currentStep);

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile Progress Bar */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Paso {currentStepIndex + 1} de {steps.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {steps[currentStepIndex]?.label}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Current step indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
            {React.createElement(steps[currentStepIndex]?.icon || Upload, {
              className: "w-5 h-5 text-blue-600 mr-2"
            })}
            <span className="text-sm font-medium text-blue-700">
              {steps[currentStepIndex]?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Steps */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 lg:space-x-4">
            {steps.map(({ step, label, icon: Icon }, index) => {
              const isActive = currentStep === step;
              const isCompleted = currentStepIndex > index;
              
              return (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' :
                      isCompleted ? 'bg-green-600 border-green-600 text-white' :
                      'bg-gray-200 border-gray-300 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-blue-600' :
                      isCompleted ? 'text-green-600' :
                      'text-gray-500'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 lg:w-8 h-0.5 mx-2 lg:mx-4 transition-colors duration-500 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}