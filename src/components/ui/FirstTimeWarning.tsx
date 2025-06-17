import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock, ExternalLink, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function FirstTimeWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'active' | 'inactive' | 'error'>('checking');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    // Always show the warning on page load
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
      checkServerStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const checkServerStatus = async () => {
    setIsCheckingStatus(true);
    setServerStatus('checking');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const healthUrl = `${API_BASE_URL}/health`;
      console.log('Checking server status at:', healthUrl);

      const response = await fetch(healthUrl, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);
        setServerStatus('active');
      } else {
        console.log('Server responded with error:', response.status);
        setServerStatus('inactive');
      }
    } catch (error) {
      console.log('Server check failed:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        setServerStatus('inactive');
      } else {
        setServerStatus('error');
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleWakeUpServer = () => {
    // Get the correct server URL
    const serverUrl = API_BASE_URL.replace('/api', '');
    const healthUrl = `${serverUrl}/health`;
    
    console.log('Opening server URL:', healthUrl);
    
    // Open the health endpoint in a new tab to wake up the server
    window.open(healthUrl, '_blank', 'noopener,noreferrer');
    
    // Show immediate feedback
    setServerStatus('checking');
    
    // Recheck server status after a delay
    setTimeout(() => {
      checkServerStatus();
    }, 5000); // Wait 5 seconds for server to wake up
  };

  const handleCheckStatus = () => {
    if (!isCheckingStatus) {
      checkServerStatus();
    }
  };

  const handleUnderstood = () => {
    handleClose();
  };

  if (!isVisible) return null;

  const getStatusConfig = () => {
    switch (serverStatus) {
      case 'checking':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
          message: 'Verificando estado del servidor...',
          showWakeButton: false
        };
      case 'active':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          message: '¡Servidor activo! Puedes usar la aplicación normalmente.',
          showWakeButton: false
        };
      case 'inactive':
      case 'error':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-200',
          message: 'El servidor parece estar inactivo. Haz clic en "Despertar Servidor" para activarlo.',
          showWakeButton: true
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          message: 'Estado desconocido',
          showWakeButton: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ${
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
              Estado del Servidor
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
          <div className="mb-6">
            {/* Server Status */}
            <div className={`flex items-start space-x-3 mb-4 p-4 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
              <div className="flex-shrink-0 mt-0.5">
                {serverStatus === 'checking' && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
                {serverStatus === 'active' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {(serverStatus === 'inactive' || serverStatus === 'error') && (
                  <Clock className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${statusConfig.color} mb-1`}>
                  Estado: {serverStatus === 'checking' ? 'Verificando...' : 
                           serverStatus === 'active' ? 'Activo' : 
                           'Inactivo'}
                </p>
                <p className="text-sm text-gray-700">
                  {statusConfig.message}
                </p>
                {/* Show server URL for debugging */}
                <p className="text-xs text-gray-500 mt-1">
                  Servidor: {API_BASE_URL.replace('/api', '')}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <p>
                  <strong>Si el servidor está inactivo:</strong> Haz clic en "Despertar Servidor" 
                  para abrir una nueva pestaña que activará el servidor.
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p>
                  <strong>Espera unos segundos</strong> en la nueva pestaña hasta que veas 
                  una respuesta del servidor (puede mostrar datos técnicos, es normal).
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p>
                  <strong>Regresa a esta pestaña</strong> y ya podrás usar la aplicación 
                  sin interrupciones. El proceso de firma será rápido.
                </p>
              </div>
            </div>

            {/* Wake up button */}
            {statusConfig.showWakeButton && (
              <div className="mt-4">
                <button
                  onClick={handleWakeUpServer}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Despertar Servidor
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Se abrirá en una nueva pestaña
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingStatus ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Verificando...
                </span>
              ) : (
                'Verificar Estado'
              )}
            </button>
            <button
              onClick={handleUnderstood}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              {serverStatus === 'active' ? 'Continuar' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}