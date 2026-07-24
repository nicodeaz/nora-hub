import React, { useState } from 'react';
import { TestimonialItem } from '../types';
import { Sparkle } from './Sparkle';
import { X, Heart, Plus, Copy, Check, Trash2, Share2, CheckCircle2, Clock } from 'lucide-react';

interface TestimonialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials: TestimonialItem[];
  onAddTestimonial: (t: TestimonialItem) => void;
  onApproveTestimonial?: (id: string) => void;
  onDeleteTestimonial: (id: string) => void;
}

export const TestimonialsModal: React.FC<TestimonialsModalProps> = ({
  isOpen,
  onClose,
  testimonials,
  onAddTestimonial,
  onApproveTestimonial,
  onDeleteTestimonial,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'form'>('all');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const pendingCount = testimonials.filter((t) => t.isApproved === false).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const newTestimonial: TestimonialItem = {
      id: Date.now().toString(),
      name,
      role: role || 'Alumni / Colega',
      message,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      isFeatured: true,
      isApproved: true, // Created directly by Nora in portal
    };

    onAddTestimonial(newTestimonial);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setRole('');
      setMessage('');
      setActiveTab('all');
    }, 1500);
  };

  const handleCopyQuote = (t: TestimonialItem) => {
    const text = `"${t.message}" — ${t.name} (${t.role})`;
    navigator.clipboard.writeText(text);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeTab === 'pending') return t.isApproved === false;
    return true; // 'all' tab shows all
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#171512]/20 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#171512]/10 bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#B72A32] fill-[#B72A32]" />
            <h2 className="font-label text-base uppercase tracking-wider font-bold text-[#171512]">
              Testimonios & Experiencias
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

        {/* Tab Controls */}
        <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-1.5 px-3.5 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              Todos ({testimonials.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`py-1.5 px-3.5 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : pendingCount > 0
                  ? 'bg-[#E8B34E]/20 text-[#171512] border border-[#E8B34E]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pendientes</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#B72A32] text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`py-1.5 px-3.5 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>
          </div>

          {/* Copy Shareable Link for Students/Colleagues */}
          <button
            onClick={() => {
              const url = window.location.origin + window.location.pathname + '#dejar-testimonio';
              navigator.clipboard.writeText(url);
              setCopiedId('share_link');
              setTimeout(() => setCopiedId(null), 2500);
            }}
            className="py-1.5 px-3 rounded-xl bg-[#E8B34E] text-[#171512] font-label text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform shrink-0"
            title="Copiar link directo para enviar a alumnos y colegas"
          >
            {copiedId === 'share_link' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>¡Link Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Link para Alumnos</span>
              </>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1 space-y-4">
          {activeTab !== 'form' ? (
            filteredTestimonials.length === 0 ? (
              <div className="text-center py-12 text-[#171512]/50 space-y-3 font-body">
                <Heart className="w-10 h-10 text-[#B72A32]/40 mx-auto" />
                <p>
                  {activeTab === 'pending'
                    ? 'No hay testimonios pendientes de aprobación.'
                    : 'Aún no hay testimonios registrados.'}
                </p>
                {activeTab === 'all' && (
                  <button
                    onClick={() => setActiveTab('form')}
                    className="py-2 px-4 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Agregar Testimonio
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTestimonials.map((t) => {
                  const isPending = t.isApproved === false;
                  return (
                    <div
                      key={t.id}
                      className={`p-5 rounded-2xl border shadow-xs space-y-3 relative transition-all ${
                        isPending
                          ? 'bg-amber-50/70 border-amber-300/80 ring-1 ring-amber-200'
                          : 'bg-[#F7EFE6] border-[#F5D3C6]'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-label text-sm font-bold text-[#171512]">
                              {t.name}
                            </h4>
                            {isPending ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-label text-[10px] uppercase font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-700" />
                                Pendiente
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-label text-[10px] uppercase font-bold">
                                Aprobado
                              </span>
                            )}
                          </div>
                          <p className="font-label text-[11px] uppercase tracking-wider text-[#B72A32] font-semibold">
                            {t.role}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 ml-auto">
                          {isPending && onApproveTestimonial && (
                            <button
                              onClick={() => onApproveTestimonial(t.id)}
                              className="py-1 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label text-xs uppercase tracking-wider font-bold flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                              title="Aprobar y publicar en el muro público"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aprobar</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyQuote(t)}
                            className="py-1 px-2 rounded-lg bg-[#F7EFE6] hover:bg-[#171512]/5 text-[#171512]/70 font-label text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 border border-[#171512]/10 cursor-pointer"
                            title="Copiar cita para la web"
                          >
                            {copiedId === t.id ? (
                              <>
                                <Check className="w-3 h-3 text-green-600" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Cita</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onDeleteTestimonial(t.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Eliminar testimonio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="font-body text-xs sm:text-sm text-[#171512]/85 italic leading-relaxed">
                        &quot;{t.message}&quot;
                      </p>

                      <p className="font-label text-[10px] text-[#171512]/40 text-right">
                        {t.date}
                      </p>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-body">
              {submitted ? (
                <div className="text-center py-10 space-y-2 text-green-800 bg-green-50 p-6 rounded-2xl border border-green-200">
                  <Heart className="w-8 h-8 text-[#B72A32] fill-[#B72A32] mx-auto animate-bounce" />
                  <h4 className="font-label text-sm uppercase tracking-wider font-bold">
                    ¡Gracias por tu experiencia!
                  </h4>
                  <p className="font-body text-xs">El testimonio se ha guardado correctamente en el portal.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Lucía Gómez"
                      className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                      Rol / Vínculo
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Ej: Alumna de Taller de Clown / Directora Teatral / Colega"
                      className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                      Mensaje / Reseña
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe tu testimonio sobre haber trabajado o tomado clases con Nora..."
                      className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className="py-2 px-4 rounded-xl border border-[#171512]/20 font-label text-xs uppercase tracking-wider text-[#171512] cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-sm"
                    >
                      Guardar Testimonio
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
