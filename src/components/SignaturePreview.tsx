import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { SignatureData } from '../types';

interface SignaturePreviewProps {
  firstName: string;
  lastName: string;
  onSignatureSelect: (signatureData: SignatureData) => void;
  onCancel: () => void;
}

// Configuration for signature API
const SIGNATURE_API_URL = 'https://onlinesignatures.net/api/get-signatures-data';
const MIN_STYLE = 0;
const MAX_STYLE = 8;
const TYPOGRAPHY_KEYS = [
  'nikita Sobolev',
  'SNikita', 
  'Nsobolev',
  'Nikita',
  'Sobolev',
  'SANikita',
  'NASobolev'
];

// Helper functions
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTypography(): string {
  return TYPOGRAPHY_KEYS[getRandomInt(0, TYPOGRAPHY_KEYS.length - 1)];
}

function buildApiUrl(firstName: string, lastName: string, styles: number): string {
  const url = new URL(SIGNATURE_API_URL);
  url.searchParams.append('first-name', firstName);
  url.searchParams.append('last-name', lastName);
  url.searchParams.append('styles', styles.toString());
  return url.toString();
}

// Fetch signature data directly from the API (from browser)
async function fetchSignatureData(firstName: string, lastName: string, signal?: AbortSignal): Promise<SignatureData> {
  const styles = getRandomInt(MIN_STYLE, MAX_STYLE);
  const apiUrl = buildApiUrl(firstName, lastName, styles);

  // Fetch from API directly from browser
  const response = await fetch(apiUrl, { signal });
  
  if (signal?.aborted) {
    throw new Error('Request aborted');
  }
  
  if (!response.ok) {
    throw new Error(`API request failed: HTTP ${response.status} ${response.statusText}`);
  }

  const apiData = await response.json();

  if (signal?.aborted) {
    throw new Error('Request aborted');
  }

  if (!apiData.data) {
    throw new Error('Invalid API response: missing data field');
  }

  const providers = Object.keys(apiData.data);
  
  if (providers.length === 0) {
    throw new Error('No providers available in API response');
  }

  // Select random provider and typography
  const randomProvider = providers[getRandomInt(0, providers.length - 1)];
  const signatures = apiData.data[randomProvider];
  const typographyKey = getRandomTypography();
  const signature = signatures[typographyKey];

  // Find a valid signature
  const selectedSignature = (signature && signature.image) 
    ? signature 
    : Object.values(signatures).find((sig: any) => sig?.image);

  if (!selectedSignature || !selectedSignature.image) {
    throw new Error(`No valid signature found for provider '${randomProvider}'`);
  }

  // Download the signature image
  const imageResponse = await fetch(selectedSignature.image, { signal });
  
  if (signal?.aborted) {
    throw new Error('Request aborted');
  }
  
  if (!imageResponse.ok) {
    throw new Error(`Failed to download signature image: ${imageResponse.status}`);
  }

  const imageBuffer = await imageResponse.arrayBuffer();

  if (signal?.aborted) {
    throw new Error('Request aborted');
  }

  return {
    imageUrl: selectedSignature.image,
    imageBuffer: imageBuffer,
    metadata: {
      firstName,
      lastName,
      provider: randomProvider,
      typographyKey,
      usedStyle: styles,
      generatedAt: new Date().toISOString()
    }
  };
}

export function SignaturePreview({ firstName, lastName, onSignatureSelect, onCancel }: SignaturePreviewProps) {
  const [currentSignature, setCurrentSignature] = useState<SignatureData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track state and prevent duplicate calls
  const isGeneratingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastGeneratedRef = useRef<string>('');

  const generateSignature = useCallback(async () => {
    // Prevent duplicate requests
    if (isGeneratingRef.current) {
      return;
    }
    
    // Create a unique key for this generation request
    const requestKey = `${firstName.trim()}-${lastName.trim()}`;
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    isGeneratingRef.current = true;
    setIsGenerating(true);
    setError(null);

    try {
      // Try to call API directly from browser first (avoids IP blocking)
      // If CORS fails, fallback to server proxy
      let signatureData: SignatureData;
      
      try {
        signatureData = await fetchSignatureData(
          firstName.trim(),
          lastName.trim(),
          abortController.signal
        );
      } catch (directError: any) {
        // Check if request was aborted
        if (abortController.signal.aborted || directError.message === 'Request aborted') {
          return;
        }
        
        // If direct call fails (likely CORS or network error), use server as proxy
        const isCorsError = directError.message?.includes('Failed to fetch') || 
                           directError.message?.includes('CORS') ||
                           directError.name === 'TypeError';
        
        if (isCorsError) {
          console.log('CORS error detected, using server proxy instead');
        } else {
          console.log('Direct API call failed, using server proxy:', directError);
        }
        
        const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_BASE_URL}/generate-signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }),
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error generando la firma');
        }

        const data = await response.json();
        
        if (abortController.signal.aborted) {
          return;
        }
        
        // Convert imageUrl to ArrayBuffer for compatibility
        const imageResponse = await fetch(data.imageUrl, {
          signal: abortController.signal,
        });
        
        if (abortController.signal.aborted) {
          return;
        }
        
        if (!imageResponse.ok) {
          throw new Error(`Failed to download signature image: ${imageResponse.status}`);
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        
        signatureData = {
          imageUrl: data.imageUrl,
          imageBuffer: imageBuffer,
          metadata: data.metadata
        };
      }
      
      // Only update state if request wasn't aborted
      if (!abortController.signal.aborted) {
        setCurrentSignature(signatureData);
        lastGeneratedRef.current = requestKey;
      }
    } catch (error: any) {
      // Don't set error if request was aborted
      if (error.name === 'AbortError' || 
          abortController.signal.aborted || 
          error.message === 'Request aborted') {
        return;
      }
      console.error('Error generating signature:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      // Only reset if this is still the current request
      if (!abortController.signal.aborted) {
        isGeneratingRef.current = false;
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    }
  }, [firstName, lastName]);

  // Debounce the generate function to prevent rapid clicks
  const debouncedGenerate = useDebounce(generateSignature, 500);

  // Only generate signature once when component mounts or when firstName/lastName actually change
  useEffect(() => {
    const requestKey = `${firstName.trim()}-${lastName.trim()}`;
    
    // Only generate if:
    // 1. Not currently generating
    // 2. This is a different request than the last one
    // 3. Both firstName and lastName are not empty
    if (!isGeneratingRef.current && 
        lastGeneratedRef.current !== requestKey &&
        firstName.trim() && 
        lastName.trim()) {
      generateSignature();
    }
    
    // Cleanup: abort any pending requests when component unmounts or props change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isGeneratingRef.current = false;
    };
  }, [firstName, lastName, generateSignature]);

  const handleSelectSignature = useCallback(() => {
    if (currentSignature && !isGenerating) {
      onSignatureSelect(currentSignature);
    }
  }, [currentSignature, isGenerating, onSignatureSelect]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Vista Previa de la Firma
            </h2>
            <p className="text-gray-600">
              Para: <span className="font-semibold">{firstName} {lastName}</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-gray-600">Generando firma manuscrita...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={debouncedGenerate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : currentSignature ? (
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border-2 border-dashed border-gray-200">
                  <img
                    src={currentSignature.imageUrl}
                    alt="Firma generada"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '120px' }}
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Estilo: {currentSignature.metadata.typographyKey} • 
                  Proveedor: {currentSignature.metadata.provider}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={debouncedGenerate}
              disabled={isGenerating}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generando...' : 'Generar Nueva Firma'}
            </button>

            <button
              onClick={handleSelectSignature}
              disabled={!currentSignature || isGenerating}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5 mr-2" />
              Usar Esta Firma
            </button>

            <button
              onClick={onCancel}
              disabled={isGenerating}
              className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}