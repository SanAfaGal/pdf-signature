import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

const STORAGE_KEY = 'pdf-signature-app-first-visit';

export function FirstTimeWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem(STORAGE_KEY);
    
    if (!hasVisited) {
      // Show the warning after a brief delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      // Mark as visited so it won't show again
      localStorage.setItem(STORAGE_KEY, 'true');
    }, 300);
  };

  const handleUnderstood = () => {
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Aviso Importante
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="mb-4">
            <div className="flex items-start space-x-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Primera vez usando la aplicación:</strong> El servidor puede tardar 
                  unos segundos adicionales en responder cuando generes tu primera firma, 
                  ya que necesita "despertar\" después de estar inactivo.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Una vez que generes la primera firma, 
                el proceso será mucho más rápido para las siguientes.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Cerrar
            </button>
            <button
              onClick={handleUnderstood}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}