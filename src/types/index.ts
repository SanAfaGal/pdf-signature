export interface ProcessingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
}

export interface SignatureData {
  imageUrl: string;
  imageBuffer: ArrayBuffer;
  metadata: {
    firstName: string;
    lastName: string;
    provider: string;
    typographyKey: string;
    usedStyle: number;
    generatedAt: string;
  };
}

export type AppStep = 'upload' | 'form' | 'signature' | 'processing' | 'complete';

export interface AppState {
  currentStep: AppStep;
  file: File | null;
  formData: FormData;
  selectedSignature: SignatureData | null;
  processing: ProcessingState;
  downloadUrl: string | null;
  isProcessing: boolean;
}