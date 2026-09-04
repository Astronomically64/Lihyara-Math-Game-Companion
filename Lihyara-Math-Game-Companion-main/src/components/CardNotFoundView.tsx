import React from 'react';
import { HelpCircle, QrCode, Home } from 'lucide-react';

interface CardNotFoundViewProps {
  scannedCode: string;
  onRetryScan: () => void;
  onGoHome: () => void;
}

export const CardNotFoundView: React.FC<CardNotFoundViewProps> = ({
  scannedCode,
  onRetryScan,
  onGoHome,
}) => {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between max-w-3xl mx-auto p-[clamp(1rem,4vw,3rem)] bg-background/85 backdrop-blur-sm select-none">
      <div className="my-auto flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-accentTerracotta/15 flex items-center justify-center text-accentTerracotta mb-5 shadow-soft">
          <HelpCircle className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-textPrimary mb-2">
          Card Not Recognized
        </h2>

        <p className="text-sm text-textPrimary/80 mb-4 max-w-xs leading-relaxed">
          The scanned code did not match any card in the Baniwara Math Quest deck.
        </p>

        <div className="bg-surfaceCard px-4 py-2 rounded-xl border border-textMuted/20 text-xs font-mono text-textMuted mb-6">
          Scanned: <span className="text-textPrimary font-bold">{scannedCode || '(empty)'}</span>
        </div>

        <p className="text-xs text-textMuted max-w-xs">
          Make sure you are scanning an official Baniwara game card QR code.
        </p>
      </div>

      <div className="flex flex-col gap-3 pb-4">
        <button
          onClick={onRetryScan}
          className="w-full py-4 px-6 rounded-full bg-accentTerracotta text-textOnDark font-bold text-base shadow-soft flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <QrCode className="w-5 h-5 text-textOnDark" />
          <span>Scan Again</span>
        </button>

        <button
          onClick={onGoHome}
          className="w-full py-3 px-6 rounded-full bg-surfaceCard text-textPrimary font-semibold text-sm border border-textMuted/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Home className="w-4 h-4 text-primaryTeal" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};
