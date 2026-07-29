import React from 'react';
import { NoraHubWordmark } from './NoraHubWordmark';
import {
  Lock,
  Settings,
  BookOpen,
  Download,
  Newspaper,
  Heart,
  Ticket,
  Plus
} from 'lucide-react';

interface HeaderProps {
  onOpenNotes: () => void;
  onOpenSettings: () => void;
  onOpenPressKit: () => void;
  onOpenTestimonials: () => void;
  onOpenReservations: () => void;
  onOpenAddCard: () => void;
  onLock: () => void;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
  notesCount?: number;
}

// Neutral "chip" style shared by every secondary header button - a visible fill
// regardless of what surface (white header, modal, etc.) it sits on.
const CHIP_BUTTON =
  'px-3 py-2 rounded-xl bg-[#171512]/[0.06] hover:bg-[#171512]/10 border border-[#171512]/10 text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer active:scale-95';

const ICON_CHIP_BUTTON =
  'p-2 rounded-xl bg-[#171512]/[0.06] hover:bg-[#171512]/10 border border-[#171512]/10 transition-colors cursor-pointer active:scale-95';

export const Header: React.FC<HeaderProps> = ({
  onOpenNotes,
  onOpenSettings,
  onOpenPressKit,
  onOpenTestimonials,
  onOpenReservations,
  onOpenAddCard,
  onLock,
  canInstallPwa,
  onInstallPwa,
  notesCount = 0,
}) => {
  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#171512]/10 shadow-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
        <div className="flex items-center justify-between gap-3">

          <NoraHubWordmark size="md" className="shrink-0" />

          {/* Mobile Quick Actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            {canInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="p-2 rounded-xl bg-[#E8B34E] text-[#171512] active:scale-95 cursor-pointer"
                title="Instalar App"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onLock}
              className={`${ICON_CHIP_BUTTON} text-[#B72A32]`}
              title="Bloquear"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Quick Tools (bottom nav handles these on mobile) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">

            <button
              onClick={onOpenAddCard}
              className="py-2 px-3.5 rounded-xl bg-[#B72A32] hover:bg-[#962127] text-[#F7EFE6] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 whitespace-nowrap shadow-xs transition-all cursor-pointer active:scale-95"
              title="Agregar nueva tarjeta"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Tarjeta</span>
            </button>

            <button onClick={onOpenNotes} className={`relative ${CHIP_BUTTON}`} title="Cuaderno de Notas">
              <BookOpen className="w-4 h-4 text-[#B72A32]" />
              <span>Cuaderno</span>
              {notesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#E8B34E] text-[#171512] text-[10px] font-bold font-mono">
                  {notesCount}
                </span>
              )}
            </button>

            <button onClick={onOpenPressKit} className={CHIP_BUTTON} title="Material de Prensa & Bios">
              <Newspaper className="w-4 h-4 text-[#7BA8A0]" />
              <span>Prensa</span>
            </button>

            <button onClick={onOpenTestimonials} className={CHIP_BUTTON} title="Testimonios & Formulario">
              <Heart className="w-4 h-4 text-[#B72A32]" />
              <span>Testimonios</span>
            </button>

            <button onClick={onOpenReservations} className={CHIP_BUTTON} title="Reservas de Dar el Salto">
              <Ticket className="w-4 h-4 text-[#7BA8A0]" />
              <span>Reservas</span>
            </button>

            {canInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="px-3 py-2 rounded-xl bg-[#E8B34E] hover:bg-[#d8a33e] text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer active:scale-95 animate-pulse"
                title="Instalar App"
              >
                <Download className="w-4 h-4" />
                <span>Instalar</span>
              </button>
            )}

            <button onClick={onOpenSettings} className={ICON_CHIP_BUTTON} title="Ajustes">
              <Settings className="w-4 h-4 text-[#171512]" />
            </button>

            <button onClick={onLock} className={`${ICON_CHIP_BUTTON} text-[#B72A32]`} title="Bloquear">
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
