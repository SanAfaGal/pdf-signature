import { useState, useCallback } from 'react';
import { AppState, AppStep, FormData, SignatureData, ProcessingState } from '../types';

const initialState: AppState = {
  currentStep: 'upload',
  file: null,
  formData: { firstName: '', lastName: '' },
  selectedSignature: null,
  processing: { status: 'idle', message: '' },
  downloadUrl: null,
  isProcessing: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const setCurrentStep = useCallback((step: AppStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setFile = useCallback((file: File | null) => {
    setState(prev => ({ ...prev, file }));
  }, []);

  const setFormData = useCallback((formData: FormData) => {
    setState(prev => ({ ...prev, formData }));
  }, []);

  const setSelectedSignature = useCallback((signature: SignatureData | null) => {
    setState(prev => ({ ...prev, selectedSignature: signature }));
  }, []);

  const setProcessing = useCallback((processing: ProcessingState) => {
    setState(prev => ({ ...prev, processing }));
  }, []);

  const setDownloadUrl = useCallback((url: string | null) => {
    setState(prev => ({ ...prev, downloadUrl: url }));
  }, []);

  const setIsProcessing = useCallback((isProcessing: boolean) => {
    setState(prev => ({ ...prev, isProcessing }));
  }, []);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedSignature: null,
      processing: { status: 'idle', message: '' },
      downloadUrl: null,
      isProcessing: false,
    }));
  }, []);

  const startOver = useCallback(() => {
    if (state.downloadUrl) {
      URL.revokeObjectURL(state.downloadUrl);
    }
    setState(initialState);
  }, [state.downloadUrl]);

  return {
    state,
    setCurrentStep,
    setFile,
    setFormData,
    setSelectedSignature,
    setProcessing,
    setDownloadUrl,
    setIsProcessing,
    resetState,
    startOver,
  };
}