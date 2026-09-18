import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';
import Toast from './Toast';

export default function CameraScanner({ onCapture, onCancel }) {
  const [phase, setPhase] = useState('preview'); // preview, captured, processing, result, error
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrProgress, setOcrProgress] = useState('');
  const [toast, setToast] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setToast({
        message: 'Camera access denied. Please allow camera access in your browser settings.',
        type: 'error',
      });
      setTimeout(() => onCancel(), 2000);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
    setPhase('captured');
  };

  const retake = () => {
    setCapturedImage(null);
    setExtractedText('');
    setPhase('preview');
    startCamera();
  };

  const processOCR = async () => {
    setPhase('processing');
    setOcrProgress('Preparing scanner...');

    try {
      // Dynamic import of Tesseract.js
      const Tesseract = (await import('tesseract.js')).default;

      setOcrProgress('Reading document...');

      const result = await Tesseract.recognize(capturedImage, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(`Extracting text... ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const text = result.data.text.trim();

      if (text.length > 0) {
        setExtractedText(text);
        setPhase('result');
      } else {
        setToast({
          message: 'Unable to read the report clearly. Please try again or enter details manually.',
          type: 'error',
        });
        setPhase('error');
      }
    } catch (err) {
      setToast({
        message: 'OCR processing failed. You can try again or enter details manually.',
        type: 'error',
      });
      setPhase('error');
    }
  };

  const useThisReport = () => {
    onCapture(extractedText, capturedImage);
  };

  return (
    <div className="space-y-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Camera size={18} /> Scan Medical Report
          </h3>
          <button
            onClick={() => {
              stopCamera();
              onCancel();
            }}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Preview Phase */}
          {phase === 'preview' && (
            <div className="space-y-4">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[50vh] object-cover"
                />
                <div className="absolute inset-0 border-2 border-white/30 rounded-xl pointer-events-none" />
              </div>
              <p className="text-center text-sm text-gray-500 font-medium">
                Point camera at the document and tap capture
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    stopCamera();
                    onCancel();
                  }}
                  className="px-6 py-3 font-bold text-gray-500 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={capture}
                  className="px-8 py-3 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2 transition-all"
                >
                  <Camera size={18} /> Capture
                </button>
              </div>
            </div>
          )}

          {/* Captured Phase */}
          {phase === 'captured' && capturedImage && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured report"
                  className="w-full h-[50vh] object-contain"
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={retake}
                  className="px-6 py-3 font-bold text-gray-500 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={16} /> Retake
                </button>
                <button
                  onClick={processOCR}
                  className="px-8 py-3 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2 transition-all"
                >
                  <Check size={18} /> Use This Report
                </button>
              </div>
            </div>
          )}

          {/* Processing Phase */}
          {phase === 'processing' && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
              <h4 className="text-lg font-bold text-gray-800 mb-2">{ocrProgress}</h4>
              <p className="text-sm text-gray-500">Please wait while we process the image</p>
            </div>
          )}

          {/* Result Phase */}
          {phase === 'result' && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                  Extracted Information
                </h4>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto">
                  {extractedText}
                </pre>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={retake}
                  className="px-6 py-3 font-bold text-gray-500 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={16} /> Retake
                </button>
                <button
                  onClick={useThisReport}
                  className="px-8 py-3 font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg flex items-center gap-2 transition-all"
                >
                  <Check size={18} /> Save Report
                </button>
              </div>
            </div>
          )}

          {/* Error Phase */}
          {phase === 'error' && (
            <div className="space-y-4 text-center py-8">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-800">Unable to read the report clearly</h4>
              <p className="text-sm text-gray-500">The image quality may be poor or the document is not readable.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={retake}
                  className="px-6 py-3 font-bold text-gray-500 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={16} /> Try Again
                </button>
                <button
                  onClick={() => {
                    stopCamera();
                    onCancel();
                  }}
                  className="px-6 py-3 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Enter Details Manually
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
