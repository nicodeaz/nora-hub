import React, { useState, useEffect } from 'react';
import { AppConfig, HubCardItem, CardCategory } from '../types';
import { Sparkle } from './Sparkle';
import { X, Settings, Plus, RotateCcw, KeyRound, Check, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { PIN_GUARD_URL, getAdminToken, setAdminToken } from '../lib/backendConfig';

interface HubConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  editingCard?: HubCardItem | null;
  onSaveCard: (card: HubCardItem) => void;
  onDeleteCard?: (id: string) => void;
  onResetToDefault: () => void;
}

export const HubConfigModal: React.FC<HubConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  editingCard,
  onSaveCard,
  onDeleteCard,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'pin'>('card');

  // Form State for Editing/Adding a Card
  const [cardForm, setCardForm] = useState<Partial<HubCardItem>>({
    id: editingCard?.id || Date.now().toString(),
    title: editingCard?.title || '',
    description: editingCard?.description || '',
    icon: editingCard?.icon || 'Globe',
    url: editingCard?.url || 'https://',
    category: editingCard?.category || 'principal',
    accentColor: editingCard?.accentColor || 'red',
    badgeText: editingCard?.badgeText || '',
    actionType: editingCard?.actionType || 'link',
    isCustom: true,
  });

  useEffect(() => {
    if (editingCard) {
      setCardForm({
        id: editingCard.id,
        title: editingCard.title,
        description: editingCard.description,
        icon: editingCard.icon,
        url: editingCard.url,
        category: editingCard.category,
        accentColor: editingCard.accentColor,
        badgeText: editingCard.badgeText || '',
        actionType: editingCard.actionType || 'link',
        isCustom: editingCard.isCustom,
      });
      setActiveTab('card');
    } else {
      setCardForm({
        id: Date.now().toString(),
        title: '',
        description: '',
        icon: 'Globe',
        url: 'https://',
        category: 'principal',
        accentColor: 'red',
        badgeText: '',
        actionType: 'link',
        isCustom: true,
      });
    }
  }, [editingCard, isOpen]);

  // Pin Form State — the PIN itself lives server-side (mail/pin-guard.php on
  // workshops.norafilmus.com); changing it requires the same admin token used for Reservas.
  const [newPin, setNewPin] = useState('');
  const [adminToken, setAdminTokenInput] = useState(getAdminToken);
  const [pinStatus, setPinStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.title || !cardForm.url) return;

    const fullCard: HubCardItem = {
      id: cardForm.id || Date.now().toString(),
      title: cardForm.title,
      description: cardForm.description || '',
      icon: cardForm.icon || 'Compass',
      url: cardForm.url,
      category: (cardForm.category as CardCategory) || 'principal',
      accentColor: cardForm.accentColor || 'red',
      badgeText: cardForm.badgeText || '',
      actionType: cardForm.actionType || 'link',
      isCustom: true,
      isPinned: false,
    };

    onSaveCard(fullCard);
    onClose();
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || adminToken.trim() === '') return;

    setAdminToken(adminToken.trim());
    setPinStatus('saving');
    setPinError(null);

    try {
      const res = await fetch(PIN_GUARD_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken.trim() },
        body: JSON.stringify({ pin: newPin }),
      });
      let body: { success?: boolean; message?: string } = {};
      try {
        body = await res.json();
      } catch {
        // Non-JSON response — treated as a generic failure below.
      }

      if (!res.ok || body.success !== true) {
        throw new Error(body.message || `Error ${res.status}`);
      }

      setPinStatus('success');
      setNewPin('');
      setTimeout(() => setPinStatus('idle'), 2500);
    } catch (err: any) {
      setPinStatus('error');
      setPinError(err.message || 'No se pudo actualizar el PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#171512]/20 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#171512]/10 bg-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#B72A32]" />
            <h2 className="font-poster text-2xl sm:text-3xl leading-none text-[#171512]">
              Configuración y Ajustes
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

        {/* Tab Selection */}
        <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('card')}
              className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              {editingCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
            </button>

            <button
              onClick={() => setActiveTab('pin')}
              className={`py-1.5 px-3 rounded-xl font-label text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeTab === 'pin'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Cambiar PIN</span>
            </button>
          </div>

          <button
            onClick={onResetToDefault}
            className="py-1.5 px-3 rounded-xl border border-[#171512]/20 text-[#171512]/60 hover:text-[#B72A32] hover:border-[#B72A32] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1 cursor-pointer"
            title="Restablecer configuración predeterminada"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1 space-y-4">
          
          {/* TAB 1: CARD FORM */}
          {activeTab === 'card' && (
            <form onSubmit={handleCardSubmit} className="space-y-4 font-body">
              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Título de la Tarjeta
                </label>
                <input
                  type="text"
                  required
                  value={cardForm.title || ''}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  placeholder="Ej: Carpeta de Contratos 2026..."
                  className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Enlace / URL de Destino
                </label>
                <input
                  type="url"
                  required
                  value={cardForm.url || ''}
                  onChange={(e) => setCardForm({ ...cardForm, url: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Pequeña Descripción
                </label>
                <input
                  type="text"
                  value={cardForm.description || ''}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  placeholder="Ej: Archivos compartidos de producción e itinerario de gira..."
                  className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                    Categoría
                  </label>
                  <select
                    value={cardForm.category || 'principal'}
                    onChange={(e) => setCardForm({ ...cardForm, category: e.target.value as CardCategory })}
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512]"
                  >
                    <option value="principal">Principal</option>
                    <option value="gestion">Gestión</option>
                    <option value="prensa">Prensa</option>
                    <option value="comunidad">Comunidad</option>
                    <option value="recursos">Recursos</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                    Color Acento
                  </label>
                  <select
                    value={cardForm.accentColor || 'red'}
                    onChange={(e) => setCardForm({ ...cardForm, accentColor: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512]"
                  >
                    <option value="red">Rojo Bermellón (#B72A32)</option>
                    <option value="pink">Rosa Acuarela (#F5D3C6)</option>
                    <option value="teal">Verde Azulado (#7BA8A0)</option>
                    <option value="gold">Dorado (#E8B34E)</option>
                    <option value="ink">Tinta Oscura (#171512)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                    Nombre Icono Lucide
                  </label>
                  <input
                    type="text"
                    value={cardForm.icon || 'Globe'}
                    onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value })}
                    placeholder="Ej: Globe, Folder, Heart, Mail, Calendar, Instagram, Star..."
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512]"
                  />
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                    Texto de Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    value={cardForm.badgeText || ''}
                    onChange={(e) => setCardForm({ ...cardForm, badgeText: e.target.value })}
                    placeholder="Ej: Nuevo, Enlace, VIP..."
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#171512]/10 gap-2">
                {editingCard && onDeleteCard && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Estás segura de eliminar la tarjeta "${editingCard.title}"?`)) {
                        onDeleteCard(editingCard.id);
                        onClose();
                      }
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-[#B72A32]/10 hover:bg-[#B72A32]/20 text-[#B72A32] font-label text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1.5 cursor-pointer touch-manipulation"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Tarjeta</span>
                  </button>
                )}
                
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 rounded-xl border border-[#171512]/20 font-label text-xs uppercase tracking-wider text-[#171512] cursor-pointer active:scale-95 transition-transform"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-sm active:scale-95 transition-transform"
                  >
                    Guardar Tarjeta
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: PIN CODE EDIT */}
          {activeTab === 'pin' && (
            <form onSubmit={handleSavePin} className="space-y-4 font-body">
              <p className="text-xs text-[#171512]/60 leading-relaxed">
                El PIN se valida en el servidor de workshops.norafilmus.com, por eso
                necesitás el token de administrador (el mismo de mail/.env, compartido
                con Reservas) para poder cambiarlo.
              </p>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Token de administrador
                </label>
                <input
                  type="password"
                  required
                  value={adminToken}
                  onChange={(e) => setAdminTokenInput(e.target.value)}
                  placeholder="Pegá el valor de ADMIN_TOKEN de mail/.env"
                  className="w-full p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-mono text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-[#171512] font-bold mb-1">
                  Nuevo PIN de 6 dígitos
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  className="w-full max-w-xs p-3 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-base font-mono text-center tracking-[0.5em] text-[#171512] focus:outline-none focus:border-[#B72A32]"
                />
              </div>

              {pinStatus === 'success' && (
                <p className="text-xs font-label text-green-700 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> ¡PIN de acceso actualizado con éxito!
                </p>
              )}
              {pinStatus === 'error' && (
                <p className="text-xs font-label text-[#B72A32] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> {pinError}
                </p>
              )}

              <button
                type="submit"
                disabled={newPin.length !== 6 || adminToken.trim() === '' || pinStatus === 'saving'}
                className="py-2 px-5 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {pinStatus === 'saving' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Actualizar PIN</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
