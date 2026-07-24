import React, { useState } from 'react';
import { PRESS_BIOS } from '../data/initialConfig';
import { Sparkle } from './Sparkle';
import { X, Copy, Check, Newspaper, ExternalLink, Download, Globe2, FileText } from 'lucide-react';

interface PressKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossierUrl: string;
}

export const PressKitModal: React.FC<PressKitModalProps> = ({
  isOpen,
  onClose,
  dossierUrl,
}) => {
  const [selectedLang, setSelectedLang] = useState<'es' | 'en'>('es');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentBios = PRESS_BIOS.filter((b) => b.language === selectedLang);

  const handleCopyBio = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#171512]/20 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#171512]/10 bg-white">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#B72A32]" />
            <h2 className="font-label text-base uppercase tracking-wider font-bold text-[#171512]">
              Material de Prensa & Bios Oficiales
            </h2>
            <Sparkle color="gold" size={14} />
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#171512]/50 hover:text-[#B72A32] hover:bg-[#171512]/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Lang Selector */}
        <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLang('es')}
              className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all ${
                selectedLang === 'es'
                  ? 'bg-[#B72A32] text-[#F7EFE6] shadow-xs'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70 border border-[#171512]/10'
              }`}
            >
              🇦🇷 Español
            </button>
            <button
              onClick={() => setSelectedLang('en')}
              className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all ${
                selectedLang === 'en'
                  ? 'bg-[#B72A32] text-[#F7EFE6] shadow-xs'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70 border border-[#171512]/10'
              }`}
            >
              🇮🇪 English
            </button>
          </div>

          <a
            href={dossierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-4 rounded-xl bg-[#7BA8A0] hover:bg-[#68938b] text-[#171512] font-label text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Dossier Completo (PDF)</span>
          </a>
        </div>

        {/* Bios List */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1 space-y-6">
          <p className="font-body text-xs text-[#171512]/70 italic">
            Haz clic en cualquiera de las biografías oficiales para copiar el texto formateado directamente al portapapeles.
          </p>

          <div className="space-y-4">
            {currentBios.map((bio, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F7EFE6] border border-[#171512]/15 shadow-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b border-[#171512]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#B72A32]" />
                    <h3 className="font-label text-xs uppercase tracking-wider font-bold text-[#171512]">
                      {bio.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyBio(bio.text, idx)}
                    className="py-1.5 px-3 rounded-xl bg-[#B72A32]/10 hover:bg-[#B72A32] text-[#B72A32] hover:text-[#F7EFE6] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Bio</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="font-body text-xs sm:text-sm text-[#171512]/85 leading-relaxed whitespace-pre-line">
                  {bio.text}
                </p>
              </div>
            ))}
          </div>

          {/* Photos and Assets Box */}
          <div className="p-5 rounded-2xl bg-[#F5D3C6]/40 border border-[#F5D3C6] space-y-2">
            <h4 className="font-label text-xs uppercase tracking-wider font-bold text-[#171512] flex items-center gap-1.5">
              <span>📷 Carpeta de Fotos de Prensa en Alta Resolución</span>
            </h4>
            <p className="font-body text-xs text-[#171512]/80">
              Fotos de retrato oficial, fotos de funciones teatrales y talleres con créditos de fotógrafo incluidos.
            </p>
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-label text-xs uppercase tracking-wider font-bold text-[#B72A32] hover:underline pt-1"
            >
              <span>Abrir Galería en Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
