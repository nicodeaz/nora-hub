import React from 'react';
import { SignatureLogo } from './SignatureLogo';
import {
  Lock,
  Settings,
  BookOpen,
  Search,
  Download,
  Newspaper,
  Heart,
  Plus
} from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onOpenNotes: () => void;
  onOpenSettings: () => void;
  onOpenPressKit: () => void;
  onOpenTestimonials: () => void;
  onOpenAddCard: () => void;
  onLock: () => void;
  canInstallPwa?: boolean;
  onInstallPwa?: () => void;
  notesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenNotes,
  onOpenSettings,
  onOpenPressKit,
  onOpenTestimonials,
  onOpenAddCard,
  onLock,
  canInstallPwa,
  onInstallPwa,
  notesCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#171512]/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Top Bar on Mobile & Desktop: Brand Logos & Lock / Install */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSearchChange('')}>
              <SignatureLogo size="md" />
            </div>

            {/* Mobile Lock & PWA Quick Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              {canInstallPwa && (
                <button
                  onClick={onInstallPwa}
                  className="p-2 rounded-xl bg-[#E8B34E] text-[#171512] font-label text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                  title="Instalar App"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar</span>
                </button>
              )}
              <button
                onClick={onLock}
                className="p-2 rounded-xl bg-[#F7EFE6] text-[#B72A32] border border-[#171512]/15 active:scale-95 cursor-pointer"
                title="Bloquear"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Field */}
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#171512]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar accesos, carpetas, notas..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#F7EFE6] border border-[#171512]/20 text-xs font-body text-[#171512] placeholder-[#171512]/50 focus:outline-none focus:border-[#B72A32] focus:ring-1 focus:ring-[#B72A32] shadow-xs transition-all touch-manipulation"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-label text-[#171512]/50 hover:text-[#B72A32] p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Right Quick Tools (hidden on mobile, as bottom nav handles mobile) */}
          <div className="hidden md:flex items-center gap-2">
            
            <button
              onClick={onOpenAddCard}
              className="py-2 px-3.5 rounded-xl bg-[#B72A32] hover:bg-[#962127] text-[#F7EFE6] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              title="Agregar nueva tarjeta"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Tarjeta</span>
            </button>

            <button
              onClick={onOpenNotes}
              className="relative px-3 py-2 rounded-xl bg-[#F7EFE6] hover:bg-[#F5D3C6]/50 border border-[#171512]/15 text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Cuaderno de Notas"
            >
              <BookOpen className="w-4 h-4 text-[#B72A32]" />
              <span>Cuaderno</span>
              {notesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#E8B34E] text-[#171512] text-[10px] font-bold font-mono">
                  {notesCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenPressKit}
              className="px-3 py-2 rounded-xl bg-[#F7EFE6] hover:bg-[#7BA8A0]/20 border border-[#171512]/15 text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Material de Prensa & Bios"
            >
              <Newspaper className="w-4 h-4 text-[#7BA8A0]" />
              <span>Prensa</span>
            </button>

            <button
              onClick={onOpenTestimonials}
              className="px-3 py-2 rounded-xl bg-[#F7EFE6] hover:bg-[#F5D3C6]/60 border border-[#171512]/15 text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Testimonios & Formulario"
            >
              <Heart className="w-4 h-4 text-[#B72A32]" />
              <span>Testimonios</span>
            </button>

            {canInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="px-3 py-2 rounded-xl bg-[#E8B34E] hover:bg-[#d8a33e] text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 animate-pulse"
                title="Instalar App"
              >
                <Download className="w-4 h-4" />
                <span>Instalar</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-[#F7EFE6] hover:bg-[#171512]/5 border border-[#171512]/15 text-[#171512] transition-colors cursor-pointer"
              title="Ajustes"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onLock}
              className="p-2 rounded-xl bg-[#F7EFE6] hover:bg-[#B72A32]/10 text-[#B72A32] border border-[#171512]/15 transition-colors cursor-pointer"
              title="Bloquear"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
