import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ChevronLeft, Camera, AlertCircle, RefreshCw, Upload, Sparkles, SwitchCamera } from 'lucide-react';
import { parseQrPayload } from '../utils/cardService';

interface ScannerViewProps {
  onScanSuccess: (qrId: string) => void;
  onBack: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanSuccess, onBack }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);

  const qrRegionId = 'html5qr-code-region';

  // Stop camera helper
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
  }, []);

  // Initialize and start scanner
  const startScanner = useCallback(async (cameraIdOrFacing?: string | { facingMode: string }) => {
    setPermissionDenied(false);
    setErrorMessage(null);
    setIsScanning(false);

    try {
      // Check available cameras
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setHasCamera(false);
        setErrorMessage('No camera was detected on this device.');
        return;
      }

      setHasCamera(true);
      setCameras(devices);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrRegionId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
      } else if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      const cameraConfig = cameraIdOrFacing || { facingMode: 'environment' };

      const qrConfig = {
        fps: 15,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        cameraConfig,
        qrConfig,
        (decodedText: string) => {
          // Successful QR decode
          const qrId = parseQrPayload(decodedText);
          if (qrId) {
            stopScanner().then(() => {
              onScanSuccess(qrId);
            });
          }
        },
        () => {
          // Scan failure in frame (ignore continuous frame scans)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('Camera startup error:', err);
      const errMsg = err?.message || String(err);
      if (
        errMsg.includes('Permission') ||
        errMsg.includes('NotAllowedError') ||
        errMsg.includes('Permission denied')
      ) {
        setPermissionDenied(true);
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser settings.');
      } else if (errMsg.includes('NotFoundError') || errMsg.includes('DevicesNotFoundError')) {
        setHasCamera(false);
        setErrorMessage('No camera device found.');
      } else {
        setErrorMessage('Unable to access camera feed. Please check browser permissions and reload.');
      }
      setIsScanning(false);
    }
  }, [onScanSuccess, stopScanner]);

  // Switch between available cameras
  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const nextIdx = (activeCameraIndex + 1) % cameras.length;
    setActiveCameraIndex(nextIdx);
    await startScanner(cameras[nextIdx].id);
  };

  // Image file QR scanner fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrRegionId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
      }
      const result = await scannerRef.current.scanFile(file, true);
      const qrId = parseQrPayload(result);
      if (qrId) {
        await stopScanner();
        onScanSuccess(qrId);
      } else {
        setErrorMessage('Could not find a valid Baniwara QR code in that image.');
      }
    } catch (err) {
      setErrorMessage('Could not detect a QR code from the selected image.');
    }
  };

  // Manual code submit (e.g. g7e01)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      const qrId = parseQrPayload(manualInput);
      stopScanner().then(() => {
        onScanSuccess(qrId);
      });
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="relative w-full h-[100dvh] bg-[#111616] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-5 pt-8 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={async () => {
            await stopScanner();
            onBack();
          }}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
          aria-label="Go back to Home"
        >
          <ChevronLeft className="w-6 h-6 text-textOnDark" />
        </button>

        {cameras.length > 1 && (
          <button
            onClick={handleSwitchCamera}
            className="px-3 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center gap-1.5 text-xs font-medium border border-white/10 active:scale-95 transition-transform"
          >
            <SwitchCamera className="w-4 h-4 text-accentGold" />
            <span>Switch</span>
          </button>
        )}
      </div>

      {/* Main Camera Viewport Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        {/* html5-qrcode video element container */}
        <div id={qrRegionId} className="w-full h-full object-cover flex items-center justify-center overflow-hidden" />

        {/* Custom Target QR Overlay (Corner brackets) */}
        {isScanning && !permissionDenied && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* 260x260 Targeting Frame */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-16 animate-scan-pulse">
              {/* Top-Left Bracket */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-accentGold rounded-tl-xl shadow-sm" />
              {/* Top-Right Bracket */}
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-accentGold rounded-tr-xl shadow-sm" />
              {/* Bottom-Left Bracket */}
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-accentGold rounded-bl-xl shadow-sm" />
              {/* Bottom-Right Bracket */}
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-accentGold rounded-br-xl shadow-sm" />

              {/* Subdued Center Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-6 h-0.5 bg-accentGold/60 rounded-full" />
                <div className="h-6 w-0.5 bg-accentGold/60 rounded-full absolute" />
              </div>
            </div>
          </div>
        )}

        {/* Permission Denied or Error State */}
        {(permissionDenied || hasCamera === false || errorMessage) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-[#173F3E]/95 backdrop-blur-md text-center">
            <div className="max-w-sm bg-surfaceCard p-6 rounded-3xl shadow-soft-lg flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accentTerracotta/15 flex items-center justify-center text-accentTerracotta mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-textPrimary mb-2">
                {permissionDenied ? 'Camera Access Needed' : 'Camera Unavailable'}
              </h3>
              <p className="text-sm text-textPrimary/80 mb-6 leading-relaxed">
                {errorMessage || 'Please allow camera permission in your browser to scan the cards.'}
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => startScanner()}
                  className="w-full py-3.5 px-4 rounded-full bg-primaryTeal text-textOnDark font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Camera Again</span>
                </button>

                {/* Upload Image Fallback */}
                <label className="w-full py-3 px-4 rounded-full bg-background text-textPrimary font-medium text-sm border border-textMuted/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform">
                  <Upload className="w-4 h-4 text-primaryTeal" />
                  <span>Upload QR Image / Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {/* Manual Code Input Toggle */}
                <button
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs text-textMuted font-medium pt-1 hover:text-textPrimary"
                >
                  {showManualInput ? 'Hide manual code entry' : 'Or enter card code manually'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Card Overlay (from UI Spec 4.2) */}
      <div className="relative z-30 p-5 pb-8 w-full">
        <div className="max-w-md mx-auto bg-[#173F3E]/90 backdrop-blur-md rounded-3xl p-5 border border-white/10 text-center shadow-soft-lg text-textOnDark">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-accentGold" />
            <h2 className="text-lg font-bold font-serif tracking-tight">Target QR Code</h2>
          </div>
          <p className="text-xs sm:text-sm text-textOnDark/80 leading-relaxed max-w-xs mx-auto">
            Point your camera at the location card to reveal the challenge.
          </p>

          {/* Quick manual entry helper for testing or table accessibility */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-3">
            <label className="text-xs text-accentGold flex items-center gap-1 cursor-pointer font-medium hover:underline">
              <Camera className="w-3.5 h-3.5" />
              <span>Select Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <span className="text-white/30 text-xs">•</span>
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs text-white/80 font-medium hover:text-white hover:underline"
            >
              Enter Code
            </button>
          </div>

          {/* Expandable Manual Input & Sample Cards */}
          {showManualInput && (
            <div className="mt-3 flex flex-col gap-2.5 text-left">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. g7e01, g8a02, g9d03..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-accentGold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accentGold text-textPrimary font-semibold text-xs rounded-xl active:scale-95 transition-transform"
                >
                  Load Card
                </button>
              </form>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-bold text-accentGold uppercase tracking-wider block mb-1.5">
                  Quick Test Cards:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'g7e01', label: 'G7 Polygons' },
                    { id: 'g7a03', label: 'G7 Fraction' },
                    { id: 'g8e09', label: 'G8 Products' },
                    { id: 'g8a01', label: 'G8 Distributive' },
                    { id: 'g9e01', label: 'G9 Slope' },
                    { id: 'g9a08', label: 'G9 Area' },
                    { id: 'g10e01', label: 'G10 Angles' },
                    { id: 'g10d02', label: 'G10 Cosines' },
                  ].map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        stopScanner().then(() => {
                          onScanSuccess(sample.id);
                        });
                      }}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-white/10 hover:bg-accentGold hover:text-textPrimary text-white font-medium transition-colors border border-white/10 active:scale-95"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
