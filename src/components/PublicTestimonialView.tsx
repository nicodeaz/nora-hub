import React, { useState } from 'react';
import { TestimonialItem } from '../types';
import { SignatureLogo } from './SignatureLogo';
import { WatercolorBackground } from './WatercolorBackground';
import { Sparkle } from './Sparkle';
import { Heart, Star, Send, CheckCircle2, Lock, Share2, Check } from 'lucide-react';

interface PublicTestimonialViewProps {
  onAddTestimonial: (testimonial: TestimonialItem) => void;
  onGoToPortal: () => void;
}

export const PublicTestimonialView: React.FC<PublicTestimonialViewProps> = ({
  onAddTestimonial,
  onGoToPortal,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newTestimonial: TestimonialItem = {
      id: Date.now().toString(),
      name: name.trim(),
      role: role.trim() || 'Estudiante / Colega',
      message: message.trim(),
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      isFeatured: true,
      isApproved: false, // Default pending approval
    };

    onAddTestimonial(newTestimonial);
    setSubmitted(true);
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#dejar-testimonio';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="relative min-h-screen bg-[#F7EFE6] text-[#171512] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-body overflow-x-hidden select-none">
      <WatercolorBackground />

      {/* Top Header Bar */}
      <div className="relative z-10 max-w-xl mx-auto w-full flex items-center justify-between pt-2 pb-4 border-b border-[#171512]/10">
        <SignatureLogo size="sm" />
        <button
          onClick={onGoToPortal}
          className="px-3 py-1.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/15 text-[#171512]/70 hover:text-[#B72A32] font-label text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Acceso Portal</span>
        </button>
      </div>

      {/* Main Card */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-6">
        <div className="bg-[#F7EFE6]/90 backdrop-blur-md rounded-3xl border border-[#171512]/15 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Section Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#B72A32]/10 text-[#B72A32] mb-1">
              <Heart className="w-7 h-7 fill-[#B72A32]" />
            </div>
            <h1 className="font-title text-2xl sm:text-3xl text-[#171512] tracking-wide">
              Dejar una Reseña / Testimonio
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#171512]/75 max-w-md mx-auto italic">
              Comparte tu experiencia como estudiante en los talleres de clown, actuación, docencia o proyectos teatrales con Nora Filmus.
            </p>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4 bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h2 className="font-label text-base uppercase tracking-wider font-bold text-emerald-900">
                ¡Muchas gracias, {name}!
              </h2>
              <p className="font-body text-xs sm:text-sm text-emerald-800 leading-relaxed">
                Tu testimonio ha sido enviado exitosamente. Quedará en estado <strong>Pendiente de Aprobación</strong> y se publicará en el muro en cuanto Nora lo revise. ¡Muchas gracias!
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setName('');
                    setRole('');
                    setMessage('');
                    setSubmitted(false);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold active:scale-95 cursor-pointer shadow-sm"
                >
                  Escribir otro testimonio
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#171512]/20 font-label text-xs uppercase tracking-wider text-[#171512] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? '¡Link Copiado!' : 'Compartir Formulario'}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
              {/* Star Rating */}
              <div className="space-y-1">
                <label className="block font-label text-[11px] uppercase tracking-wider text-[#171512]/80 font-bold">
                  Experiencia General
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-[#E8B34E] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-[#E8B34E]' : 'fill-none stroke-[#171512]/30'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-label text-xs font-semibold text-[#171512]/60 ml-2">
                    {rating}/5 Estrellas
                  </span>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block font-label text-[11px] uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Nombre y Apellido <span className="text-[#B72A32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Lucía Gómez"
                  className="w-full p-3.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs sm:text-sm font-body text-[#171512] placeholder-[#171512]/40 focus:outline-none focus:border-[#B72A32] focus:ring-1 focus:ring-[#B72A32] transition-all touch-manipulation"
                />
              </div>

              {/* Rol / Vínculo */}
              <div>
                <label className="block font-label text-[11px] uppercase tracking-wider text-[#171512] font-bold mb-1">
                  ¿En qué proyecto o taller participaste?
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ej: Taller de Clown 2025 / Seminario de Actuación / Colega"
                  className="w-full p-3.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs sm:text-sm font-body text-[#171512] placeholder-[#171512]/40 focus:outline-none focus:border-[#B72A32] focus:ring-1 focus:ring-[#B72A32] transition-all touch-manipulation"
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="block font-label text-[11px] uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Tu Mensaje / Reseña <span className="text-[#B72A32]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos cómo fue tu experiencia aprendiendo o trabajando junto a Nora..."
                  className="w-full p-3.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs sm:text-sm font-body text-[#171512] placeholder-[#171512]/40 focus:outline-none focus:border-[#B72A32] focus:ring-1 focus:ring-[#B72A32] transition-all touch-manipulation"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-3 px-3.5 rounded-xl border border-[#171512]/20 font-label text-xs uppercase tracking-wider text-[#171512]/70 hover:text-[#171512] flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                  title="Copiar link directo a este formulario"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Link Copiado' : 'Copiar Link'}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#B72A32] hover:bg-[#962127] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Testimonio</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 font-label text-[10px] uppercase tracking-widest text-[#171512]/40">
        Nora Filmus
      </footer>
    </div>
  );
};
