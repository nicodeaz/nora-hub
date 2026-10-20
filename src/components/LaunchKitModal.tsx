import React, { useEffect, useState } from 'react';
import { Sparkle } from './Sparkle';
import { X, Copy, Check, Megaphone, Download, Lightbulb } from 'lucide-react';
import {
  KitImage,
  KitLang,
  KIT_CAPTIONS,
  KIT_CAROUSEL,
  KIT_POST_STEPS,
  KIT_STORY,
  KIT_STORY_STEPS,
  KIT_TIPS,
  KitStep,
  kitUrl,
} from '../data/launchKit';

interface LaunchKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// En el celular, "Guardar" abre la hoja de compartir del sistema (desde ahí
// iPhone guarda directo en Fotos, y Android ofrece Instagram/Galería). Los
// File se precargan al abrir el modal: Safari descarta navigator.share() si
// entre el toque y la llamada hubo un fetch de por medio.
const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const loadFiles = (images: KitImage[]): Promise<File[]> =>
  Promise.all(
    images.map((img) =>
      fetch(kitUrl(img.file))
        .then((r) => r.blob())
        .then((blob) => new File([blob], img.file, { type: 'image/jpeg' }))
    )
  );

const downloadOne = (img: KitImage) => {
  const a = document.createElement('a');
  a.href = kitUrl(img.file);
  a.download = img.file;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const StepList: React.FC<{ steps: KitStep[] }> = ({ steps }) => (
  <ol className="space-y-3">
    {steps.map((step, idx) => (
      <li key={idx} className="flex gap-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-[#B72A32] text-[#F7EFE6] font-label text-xs font-bold flex items-center justify-center">
          {idx + 1}
        </span>
        <div className="pt-1">
          <p className="font-body text-sm text-[#171512] font-bold leading-snug">{step.title}</p>
          {step.detail && (
            <p className="font-body text-xs sm:text-sm text-[#171512]/70 leading-relaxed mt-0.5">{step.detail}</p>
          )}
        </div>
      </li>
    ))}
  </ol>
);

export const LaunchKitModal: React.FC<LaunchKitModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<KitLang>('es');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<File[] | null>(null);
  const [storyFiles, setStoryFiles] = useState<File[] | null>(null);

  const carousel = KIT_CAROUSEL[lang];
  const story = KIT_STORY[lang];

  useEffect(() => {
    if (!isOpen || !isTouchDevice()) return;
    let cancelled = false;
    setCarouselFiles(null);
    setStoryFiles(null);
    loadFiles(carousel).then((f) => !cancelled && setCarouselFiles(f)).catch(() => {});
    loadFiles([story]).then((f) => !cancelled && setStoryFiles(f)).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOpen, lang]);

  if (!isOpen) return null;

  const save = async (images: KitImage[], files: File[] | null) => {
    if (files && navigator.canShare?.({ files })) {
      try {
        await navigator.share({ files });
        return;
      } catch (e) {
        // Cancelar la hoja de compartir no es un error; cualquier otro fallo
        // cae a la descarga común.
        if ((e as DOMException)?.name === 'AbortError') return;
      }
    }
    images.forEach((img, i) => setTimeout(() => downloadOne(img), i * 400));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const langButton = (value: KitLang, label: string) => (
    <button
      onClick={() => setLang(value)}
      className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all ${
        lang === value
          ? 'bg-[#B72A32] text-[#F7EFE6] shadow-xs'
          : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70 border border-[#171512]/10'
      }`}
    >
      {label}
    </button>
  );

  const sectionTitle = (text: string) => (
    <h3 className="font-poster text-2xl sm:text-3xl leading-none text-[#171512]">{text}</h3>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#171512]/20 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#171512]/10 bg-white">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#B72A32]" />
            <h2 className="font-poster text-2xl sm:text-3xl leading-none text-[#171512]">
              Lanzamiento web · Instagram
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

        {/* Lang Selector */}
        <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {langButton('es', '🇦🇷 Español')}
            {langButton('en', '🇮🇪 English')}
          </div>
          <p className="font-body text-xs text-[#171512]/60 italic">Imágenes en el idioma elegido</p>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-8">

          {/* 1. Carrusel */}
          <section className="space-y-4">
            <div className="space-y-1">
              {sectionTitle('1 · Carrusel (5 imágenes)')}
              <p className="font-body text-xs sm:text-sm text-[#171512]/70">
                Un solo post con las 5 imágenes, en este orden. Tocá una para verla grande.
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 touch-pan-x">
              {carousel.map((img) => (
                <div key={img.file} className="shrink-0 w-36 sm:w-40 space-y-1.5">
                  <a href={kitUrl(img.file)} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={kitUrl(img.file)}
                      alt={img.label}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover rounded-xl border border-[#171512]/15 bg-[#171512]"
                    />
                  </a>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label text-[11px] uppercase tracking-wider font-semibold text-[#171512]/70">
                      {img.label}
                    </span>
                    <button
                      onClick={() => downloadOne(img)}
                      aria-label={`Descargar ${img.label}`}
                      className="p-1.5 rounded-lg text-[#B72A32] hover:bg-[#B72A32]/10 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => save(carousel, carouselFiles)}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#B72A32] hover:bg-[#9c222a] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Guardar las 5</span>
            </button>

            <div className="p-5 rounded-2xl bg-[#F7EFE6] border border-[#171512]/15 space-y-4">
              <h4 className="font-label text-xs uppercase tracking-wider font-bold text-[#171512]">
                Cómo publicarlo
              </h4>
              <StepList steps={KIT_POST_STEPS} />
            </div>
          </section>

          {/* 2. Textos */}
          <section className="space-y-4">
            <div className="space-y-1">
              {sectionTitle('2 · Texto del post')}
              <p className="font-body text-xs sm:text-sm text-[#171512]/70">
                Elegí uno, tocá "Copiar" y pegalo en Instagram.
              </p>
            </div>
            {KIT_CAPTIONS.map((caption) => (
              <div key={caption.id} className="p-5 rounded-2xl bg-[#F7EFE6] border border-[#171512]/15 space-y-3">
                <div className="flex items-center justify-between border-b border-[#171512]/10 pb-2">
                  <h4 className="font-label text-xs uppercase tracking-wider font-bold text-[#171512]">
                    {caption.title}
                  </h4>
                  <button
                    onClick={() => handleCopy(caption.id, caption.text)}
                    className="py-1.5 px-3 rounded-xl bg-[#B72A32]/10 hover:bg-[#B72A32] text-[#B72A32] hover:text-[#F7EFE6] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === caption.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-body text-xs sm:text-sm text-[#171512]/85 leading-relaxed whitespace-pre-line">
                  {caption.text}
                </p>
              </div>
            ))}
          </section>

          {/* 3. Historia */}
          <section className="space-y-4">
            <div className="space-y-1">
              {sectionTitle('3 · Historia con link')}
              <p className="font-body text-xs sm:text-sm text-[#171512]/70">
                Es la que lleva a la gente a la web: en las historias el link sí se puede tocar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="shrink-0 w-40 space-y-2">
                <a href={kitUrl(story.file)} target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src={kitUrl(story.file)}
                    alt={story.label}
                    loading="lazy"
                    className="w-full aspect-[9/16] object-cover rounded-xl border border-[#171512]/15 bg-[#171512]"
                  />
                </a>
                <button
                  onClick={() => save([story], storyFiles)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#B72A32] hover:bg-[#9c222a] text-[#F7EFE6] font-label text-[11px] uppercase tracking-wider font-bold inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Guardar historia</span>
                </button>
              </div>
              <div className="flex-1 p-5 rounded-2xl bg-[#F7EFE6] border border-[#171512]/15 space-y-4 w-full">
                <h4 className="font-label text-xs uppercase tracking-wider font-bold text-[#171512]">
                  Cómo publicarla
                </h4>
                <StepList steps={KIT_STORY_STEPS} />
              </div>
            </div>
          </section>

          {/* 4. Consejos */}
          <section className="p-5 rounded-2xl bg-[#F5D3C6]/40 border border-[#F5D3C6] space-y-3">
            <h4 className="font-label text-xs uppercase tracking-wider font-bold text-[#171512] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#B72A32]" />
              <span>Consejos</span>
            </h4>
            <ul className="space-y-2">
              {KIT_TIPS.map((tip, idx) => (
                <li key={idx} className="font-body text-xs sm:text-sm text-[#171512]/85 leading-relaxed flex gap-2">
                  <span className="text-[#B72A32]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
