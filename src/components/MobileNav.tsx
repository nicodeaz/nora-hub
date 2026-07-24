import React from 'react';
import { LayoutGrid, BookOpen, Newspaper, Heart, Settings, Plus } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'home' | 'notes' | 'press' | 'testimonials' | 'settings';
  onSelectTab: (tab: 'home' | 'notes' | 'press' | 'testimonials' | 'settings') => void;
  onOpenAddCard: () => void;
  notesCount?: number;
}

const TAB_BUTTON =
  'flex flex-col items-center justify-center flex-1 h-full gap-0.5 px-1 transition-colors cursor-pointer active:scale-95 touch-manipulation';

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddCard,
  notesCount = 0,
}) => {
  const isActive = (tab: MobileNavProps['activeTab']) => activeTab === tab;
  const tabColor = (tab: MobileNavProps['activeTab']) =>
    isActive(tab) ? 'text-[#B72A32]' : 'text-[#171512]/50 hover:text-[#171512]';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#171512]/10 shadow-[0_-4px_16px_rgba(23,21,18,0.06)] pb-safe md:hidden">
      <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">

        <button onClick={() => onSelectTab('home')} className={`${TAB_BUTTON} ${tabColor('home')}`}>
          <LayoutGrid className="w-5 h-5" />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Inicio</span>
        </button>

        <button onClick={() => onSelectTab('notes')} className={`${TAB_BUTTON} ${tabColor('notes')}`}>
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {notesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-[#E8B34E] text-[#171512] text-[9px] font-bold font-mono flex items-center justify-center">
                {notesCount}
              </span>
            )}
          </div>
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Cuaderno</span>
        </button>

        <button onClick={() => onSelectTab('testimonials')} className={`${TAB_BUTTON} ${tabColor('testimonials')}`}>
          <Heart className={`w-5 h-5 ${isActive('testimonials') ? 'fill-[#B72A32]' : ''}`} />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Reseñas</span>
        </button>

        {/* Center FAB: Agregar Tarjeta */}
        <button
          onClick={onOpenAddCard}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#B72A32] text-[#F7EFE6] shadow-lg shadow-[#B72A32]/30 shrink-0 mx-1 -translate-y-3 hover:bg-[#962127] active:scale-90 transition-all cursor-pointer touch-manipulation"
          title="Agregar Tarjeta"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button onClick={() => onSelectTab('press')} className={`${TAB_BUTTON} ${tabColor('press')}`}>
          <Newspaper className="w-5 h-5" />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Prensa</span>
        </button>

        <button onClick={() => onSelectTab('settings')} className={`${TAB_BUTTON} ${tabColor('settings')}`}>
          <Settings className="w-5 h-5" />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Ajustes</span>
        </button>

      </div>
    </div>
  );
};
