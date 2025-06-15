import React from 'react';
import { CheckCircle, Upload, User, Edit3, FileText, Download } from 'lucide-react';

const instructionSteps = [
  {
    icon: Upload,
    title: 'Subir PDF',
    description: 'Selecciona el documento que deseas firmar',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    icon: User,
    title: 'Ingresar datos',
    description: 'Escribe tu nombre y apellido correctamente',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    icon: Edit3,
    title: 'Generar firma',
    description: 'Visualiza y regenera hasta que te guste',
    color: 'text-green-600 bg-green-50'
  },
  {
    icon: FileText,
    title: 'Procesamiento',
    description: 'La firma se inserta automáticamente',
    color: 'text-orange-600 bg-orange-50'
  },
  {
    icon: Download,
    title: 'Descargar',
    description: 'Obtén tu PDF firmado digitalmente',
    color: 'text-red-600 bg-red-50'
  }
];

export function Instructions() {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-100 shadow-sm">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full mr-3">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Proceso paso a paso
          </h3>
        </div>

        {/* Mobile Layout - Vertical Cards */}
        <div className="block sm:hidden space-y-3">
          {instructionSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step.color} flex-shrink-0`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mr-2">
                      {index + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet Layout - 2 Columns */}
        <div className="hidden sm:block md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {instructionSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step.color} mr-3`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                    {index + 1}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Horizontal Flow */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {instructionSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step.color} mb-3`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-2">
                      {index + 1}
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Arrow connector for desktop */}
                {index < instructionSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-4 bg-white border-r-2 border-t-2 border-gray-300 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tip */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 rounded-xl border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-800 text-center">
            💡 <strong>Tip:</strong> El proceso es completamente automático. Solo necesitas subir tu PDF y proporcionar tu nombre.
          </p>
        </div>
      </div>
    </div>
  );
}