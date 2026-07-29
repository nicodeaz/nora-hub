import React, { useEffect, useState } from 'react';
import { ReservationRecord } from '../types';
import {
  X,
  Ticket,
  RefreshCw,
  CheckCircle2,
  Circle,
  MessageCircle,
  Mail,
  Settings2,
  AlertTriangle,
  ChevronDown,
  Globe2,
} from 'lucide-react';
import { RESERVATIONS_URL, getAdminToken, setAdminToken } from '../lib/backendConfig';

interface ReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CACHE_KEY = 'nora_hub_reservations_cache';

function loadCache(): ReservationRecord[] {
  const saved = localStorage.getItem(CACHE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

const paymentLabel = (r: ReservationRecord) => (r.opcionPago === 'total30' ? 'Pago total' : 'Seña');

export const ReservationsModal: React.FC<ReservationsModalProps> = ({ isOpen, onClose }) => {
  const [adminToken, setAdminTokenState] = useState<string>(getAdminToken);
  const [reservations, setReservations] = useState<ReservationRecord[]>(loadCache);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const fetchReservations = async (token = adminToken) => {
    if (!token) {
      setShowSettings(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(RESERVATIONS_URL, {
        headers: { 'X-Admin-Token': token },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Error ${res.status}`);
      }
      setReservations(json.reservations);
    } catch (e: any) {
      setError(e.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminToken) {
      fetchReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveToken = () => {
    setAdminToken(adminToken.trim());
    setAdminTokenState(adminToken.trim());
    setShowSettings(false);
    fetchReservations(adminToken.trim());
  };

  const handleTogglePaid = async (r: ReservationRecord) => {
    const nextPaid = !r.paid;
    setPendingId(r.id);
    // Optimistic update
    setReservations((prev) => prev.map((x) => (x.id === r.id ? { ...x, paid: nextPaid } : x)));
    try {
      const res = await fetch(RESERVATIONS_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
        body: JSON.stringify({ id: r.id, paid: nextPaid }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setReservations((prev) => prev.map((x) => (x.id === r.id ? json.reservation : x)));
    } catch (e: any) {
      // Revert on failure
      setReservations((prev) => prev.map((x) => (x.id === r.id ? { ...x, paid: r.paid } : x)));
      setError(e.message || 'No se pudo actualizar el estado de pago.');
    } finally {
      setPendingId(null);
    }
  };

  const pendingCount = reservations.filter((r) => !r.paid).length;
  const totalRecaudado = reservations
    .filter((r) => r.paid)
    .reduce((sum, r) => sum + (Number(r.monto) || 0), 0);
  const filtered = reservations.filter((r) => {
    if (activeTab === 'pending') return !r.paid;
    if (activeTab === 'paid') return r.paid;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-[env(safe-area-inset-bottom)] sm:pb-4 bg-[#171512]/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl border border-[#171512]/20 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
        {/* Header — poster-style nod to the campaign flyer */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-[#171512]/10 bg-[#171512] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,42,50,0.35),transparent_60%)]" />
          <div className="relative flex items-baseline gap-2.5">
            <h2 className="font-poster text-3xl sm:text-4xl leading-none text-[#F7EFE6] tracking-wide">
              Reservas
            </h2>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#E8B34E] font-bold">
              Dar el Salto
            </span>
          </div>
          <div className="relative flex items-center gap-1.5">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="p-2 rounded-xl text-[#F7EFE6]/60 hover:text-[#F7EFE6] hover:bg-white/10 cursor-pointer"
              title="Configurar conexión"
            >
              <Settings2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#F7EFE6]/60 hover:text-[#B72A32] hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 space-y-3">
            <div>
              <label className="block font-label text-[11px] uppercase tracking-wider text-[#171512] font-bold mb-1">
                Token de administrador (ADMIN_TOKEN)
              </label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminTokenState(e.target.value)}
                placeholder="Pegá el valor de ADMIN_TOKEN de mail/.env"
                className="w-full p-2.5 rounded-xl bg-white border border-[#171512]/20 text-xs font-mono text-[#171512] focus:outline-none focus:border-[#B72A32]"
              />
              <p className="text-[11px] text-[#171512]/50 mt-1">
                Se comparte con el cambio de PIN en Ajustes — solo hace falta pegarlo una vez.
              </p>
            </div>
            <button
              onClick={handleSaveToken}
              className="py-1.5 px-3.5 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Guardar y conectar
            </button>
          </div>
        )}

        {/* Tab Controls + Stats */}
        <div className="p-4 border-b border-[#171512]/10 bg-[#F7EFE6]/50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2 items-center flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-1.5 px-3.5 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              Todas ({reservations.length})
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
              <span>Sin pagar</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#B72A32] text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`py-1.5 px-3.5 rounded-xl font-label text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                activeTab === 'paid'
                  ? 'bg-[#B72A32] text-[#F7EFE6]'
                  : 'bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70'
              }`}
            >
              Pagadas
            </button>
            {totalRecaudado > 0 && (
              <span className="font-label text-[11px] uppercase tracking-wider font-semibold text-[#171512]/50 pl-1">
                Recaudado: <strong className="text-[#171512]">{totalRecaudado} €</strong>
              </span>
            )}
          </div>

          <button
            onClick={() => fetchReservations()}
            disabled={isLoading}
            className="py-1.5 px-3 rounded-xl bg-[#171512]/[0.06] hover:bg-[#171512]/10 text-[#171512]/70 font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1">
          {error && (
            <div className="flex items-start gap-2 m-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-body">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!adminToken ? (
            <div className="text-center py-12 text-[#171512]/50 space-y-3 font-body px-6">
              <Ticket className="w-10 h-10 text-[#B72A32]/40 mx-auto" />
              <p>Configurá el token de administrador para ver las reservas.</p>
              <button
                onClick={() => setShowSettings(true)}
                className="py-2 px-4 rounded-xl bg-[#B72A32] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Configurar conexión
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-[#171512]/50 space-y-2 font-body px-6">
              <Ticket className="w-10 h-10 text-[#B72A32]/40 mx-auto" />
              <p>
                {isLoading
                  ? 'Cargando reservas...'
                  : activeTab === 'pending'
                  ? 'No hay reservas sin pagar.'
                  : activeTab === 'paid'
                  ? 'Todavía no hay reservas marcadas como pagadas.'
                  : 'Todavía no hay reservas registradas.'}
              </p>
            </div>
          ) : (
            <>
              {/* Column headers — desktop only */}
              <div className="hidden sm:grid grid-cols-[1.5fr_1.4fr_0.9fr_0.8fr_auto] gap-3 px-5 py-2 border-b border-[#171512]/10 font-label text-[10px] uppercase tracking-wider font-bold text-[#171512]/40">
                <span>Nombre</span>
                <span>Contacto</span>
                <span>Pago</span>
                <span>Fecha</span>
                <span className="text-right">Estado</span>
              </div>

              <div className="divide-y divide-[#171512]/8">
                {filtered.map((r) => {
                  const isRowPending = pendingId === r.id;
                  const isExpanded = expandedId === r.id;
                  const created = new Date(r.createdAt).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div key={r.id} className={r.paid ? 'bg-emerald-50/40' : 'bg-amber-50/30'}>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className="w-full text-left grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1.4fr_0.9fr_0.8fr_auto] gap-x-3 gap-y-1 items-center px-5 py-2.5 hover:bg-[#171512]/[0.03] cursor-pointer touch-manipulation"
                      >
                        <div className="min-w-0">
                          <p className="font-label text-sm font-bold text-[#171512] truncate">{r.nombre}</p>
                          {r.nacionalidad && (
                            <p className="text-[11px] text-[#171512]/50 flex items-center gap-1 truncate">
                              <Globe2 className="w-3 h-3 shrink-0" />
                              {r.nacionalidad}
                            </p>
                          )}
                        </div>

                        <div className="hidden sm:block min-w-0 font-body text-xs text-[#171512]/75 space-y-0.5">
                          <p className="truncate">{r.email}</p>
                          <p className="truncate">{r.telefono}</p>
                        </div>

                        <div className="hidden sm:block">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-[#171512]/[0.06] font-label text-[10px] uppercase font-bold text-[#171512]/80">
                            {paymentLabel(r)} · {r.monto} €
                          </span>
                        </div>

                        <span className="hidden sm:inline text-xs text-[#171512]/40">{created}</span>

                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePaid(r);
                          }}
                          role="button"
                          aria-disabled={isRowPending}
                          className={`justify-self-end py-1 px-2.5 rounded-lg font-label text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer touch-manipulation ${
                            isRowPending ? 'opacity-50 pointer-events-none' : ''
                          } ${
                            r.paid
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-white border border-[#171512]/20 text-[#171512]/70 hover:border-emerald-500 hover:text-emerald-700'
                          }`}
                          title={r.paid ? 'Marcar como no pagada' : 'Marcar como pagada'}
                        >
                          {r.paid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          <span className="hidden md:inline">{r.paid ? 'Pagada' : 'Pendiente'}</span>
                          <ChevronDown
                            className={`w-3 h-3 ml-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-3.5 pt-1 sm:pl-5 animate-fade-in">
                          <div className="rounded-xl border border-[#171512]/10 bg-white/70 p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5 text-xs font-body">
                            <div className="sm:hidden col-span-2 space-y-1">
                              <p className="text-[#171512]/40 font-label text-[10px] uppercase tracking-wider">Contacto</p>
                              <p className="text-[#171512]">{r.email}</p>
                              <p className="text-[#171512]">{r.telefono}</p>
                            </div>
                            <div>
                              <p className="text-[#171512]/40 font-label text-[10px] uppercase tracking-wider">Nacionalidad</p>
                              <p className="text-[#171512]">{r.nacionalidad || '—'}</p>
                            </div>
                            <div>
                              <p className="text-[#171512]/40 font-label text-[10px] uppercase tracking-wider">Idioma</p>
                              <p className="text-[#171512]">{r.lang === 'en' ? 'Inglés' : 'Español'}</p>
                            </div>
                            <div>
                              <p className="text-[#171512]/40 font-label text-[10px] uppercase tracking-wider">Inscripto el</p>
                              <p className="text-[#171512]">{new Date(r.createdAt).toLocaleString('es-ES')}</p>
                            </div>
                            <div>
                              <p className="text-[#171512]/40 font-label text-[10px] uppercase tracking-wider">Pagado el</p>
                              <p className="text-[#171512]">{r.paidAt ? new Date(r.paidAt).toLocaleString('es-ES') : '—'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-2.5 pl-1">
                            <a
                              href={`https://wa.me/${r.telefono.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-xs text-[#171512]/70 hover:text-[#B72A32]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`mailto:${r.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-xs text-[#171512]/70 hover:text-[#B72A32]"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email</span>
                            </a>
                            <span className="ml-auto text-[10px] font-mono text-[#171512]/30">#{r.id}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
