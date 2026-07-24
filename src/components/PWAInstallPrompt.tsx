import React from 'react';
import { Sparkle } from './Sparkle';
import { Download, X, Smartphone, Share, PlusSquare, Monitor, CheckCircle2 } from 'lucide-react';

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIos?: boolean;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIos = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#F7EFE6] rounded-3xl border border-[#171512]/20 shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#171512]/10 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#B72A32]" />
            <h3 className="font-label text-sm uppercase tracking-wider font-bold text-[#171512]">
              Instalar Nora Hub como App
            </h3>
            <Sparkle color="gold" size={14} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#171512]/50 hover:text-[#B72A32] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 font-body text-xs text-[#171512]/85">
          <p>
            Instala Nora Hub en tu pantalla de inicio para acceder en 1 clic desde tu teléfono o computadora, sin barra de navegador y con soporte offline.
          </p>

          {isIos ? (
            <div className="p-4 rounded-2xl bg-[#F5D3C6]/40 border border-[#F5D3C6] space-y-2">
              <p className="font-label text-xs uppercase tracking-wider font-bold text-[#171512] flex items-center gap-1.5">
                <span>📱 Pasos en iPhone / iPad (Safari):</span>
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs">
                <li className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-[#B72A32] shrink-0" />
                  <span>Presiona el botón <strong>Compartir</strong> en la barra inferior de Safari.</span>
                </li>
                <li className="flex items-center gap-2">
                  <PlusSquare className="w-4 h-4 text-[#B72A32] shrink-0" />
                  <span>Selecciona <strong>&quot;Añadir a pantalla de inicio&quot;</strong>.</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#7BA8A0]/20 border border-[#7BA8A0]/40 space-y-2">
              <p className="font-label text-xs uppercase tracking-wider font-bold text-[#171512] flex items-center gap-1.5">
                <span>💻 En Android / Chrome / Computadora:</span>
              </p>
              <p className="font-body text-xs">
                Haz clic en el botón de abajo para instalar la app nativa directamente en tu dispositivo.
              </p>
              <button
                onClick={onInstall}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#B72A32] hover:bg-[#962127] text-[#F7EFE6] font-label text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Ahora</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl border border-[#171512]/20 font-label text-xs uppercase tracking-wider text-[#171512]/70 cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
