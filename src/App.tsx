import React, { lazy, Suspense } from 'react';
import { useAppState } from './hooks/useAppState';
import { usePdfProcessor } from './hooks/usePdfProcessor';
import { FormData, SignatureData } from './types';
import { AppHeader } from './components/AppHeader';
import { ProgressSteps } from './components/ui/ProgressSteps';
import { UploadStep } from './components/steps/UploadStep';
import { FormStep } from './components/steps/FormStep';
import { ProcessingStep } from './components/steps/ProcessingStep';
import { CompleteStep } from './components/steps/CompleteStep';
import { Instructions } from './components/Instructions';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { FirstTimeWarning } from './components/ui/FirstTimeWarning';

// Lazy load heavy components
const SignaturePreview = lazy(() => 
  import('./components/SignaturePreview').then(module => ({ 
    default: module.SignaturePreview 
  }))
);

function App() {
  const {
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
  } = useAppState();

  const { processWithSignature } = usePdfProcessor();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setCurrentStep('form');
    resetState();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...state.formData,
      [field]: value
    });
  };

  const handleFormSubmit = () => {
    if (state.formData.firstName.trim() && state.formData.lastName.trim()) {
      setCurrentStep('signature');
    }
  };

  const handleSignatureSelect = async (signatureData: SignatureData) => {
    if (state.isProcessing) return; // Prevent duplicate actions
    
    setSelectedSignature(signatureData);
    setCurrentStep('processing');
    setIsProcessing(true);
    
    if (!state.file) return;

    await processWithSignature(
      state.file,
      signatureData,
      (message) => setProcessing({ status: 'loading', message }),
      (downloadUrl) => {
        setDownloadUrl(downloadUrl);
        setProcessing({ status: 'success', message: 'PDF procesado exitosamente' });
        setCurrentStep('complete');
        setIsProcessing(false);
      },
      (error) => {
        setProcessing({ status: 'error', message: error });
        setIsProcessing(false);
      }
    );
  };

  const handleSignatureCancel = () => {
    setCurrentStep('form');
  };

  const downloadFile = () => {
    if (state.downloadUrl && state.file) {
      const link = document.createElement('a');
      link.href = state.downloadUrl;
      link.download = `${state.file.name.replace('.pdf', '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRetry = () => {
    setCurrentStep('signature');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* First Time Warning */}
      <FirstTimeWarning />

      {/* Signature Preview Modal */}
      {state.currentStep === 'signature' && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full">
              <LoadingSpinner size="lg" className="mx-auto" />
              <p className="text-gray-600 mt-4 text-center text-sm sm:text-base">
                Cargando generador de firmas...
              </p>
            </div>
          </div>
        }>
          <SignaturePreview
            firstName={state.formData.firstName}
            lastName={state.formData.lastName}
            onSignatureSelect={handleSignatureSelect}
            onCancel={handleSignatureCancel}
          />
        </Suspense>
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <AppHeader />

        <div className="max-w-4xl mx-auto">
          <ProgressSteps currentStep={state.currentStep} />

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {state.currentStep === 'upload' && (
              <UploadStep onFileSelect={handleFileSelect} />
            )}

            {state.currentStep === 'form' && state.file && (
              <FormStep
                file={state.file}
                formData={state.formData}
                onInputChange={handleInputChange}
                onSubmit={handleFormSubmit}
                onStartOver={startOver}
                isProcessing={state.isProcessing}
              />
            )}

            {state.currentStep === 'processing' && (
              <ProcessingStep
                processing={state.processing}
                onRetry={handleRetry}
              />
            )}

            {state.currentStep === 'complete' && (
              <CompleteStep
                file={state.file!}
                selectedSignature={state.selectedSignature}
                onDownload={downloadFile}
                onStartOver={startOver}
              />
            )}
          </div>

          <Instructions />
        </div>
      </div>
    </div>
  );
}

export default App;