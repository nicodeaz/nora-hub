import React from 'react';
import { LayoutGrid, BookOpen, Newspaper, Heart, Settings, Plus } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'home' | 'notes' | 'press' | 'testimonials' | 'settings';
  onSelectTab: (tab: 'home' | 'notes' | 'press' | 'testimonials' | 'settings') => void;
  onOpenAddCard: () => void;
  notesCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddCard,
  notesCount = 0,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#171512]/15 shadow-lg pb-safe md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        
        {/* Tab 1: Inicio */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors cursor-pointer active:scale-95 ${
            activeTab === 'home' ? 'text-[#B72A32]' : 'text-[#171512]/60 hover:text-[#171512]'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Inicio</span>
        </button>

        {/* Tab 2: Cuaderno */}
        <button
          onClick={() => onSelectTab('notes')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors cursor-pointer active:scale-95 ${
            activeTab === 'notes' ? 'text-[#B72A32]' : 'text-[#171512]/60 hover:text-[#171512]'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5 mb-0.5" />
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-[#E8B34E] text-[#171512] text-[9px] font-bold font-mono">
                {notesCount}
              </span>
            )}
          </div>
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Cuaderno</span>
        </button>

        {/* Center Fab: Agregar Tarjeta */}
        <button
          onClick={onOpenAddCard}
          className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-[#B72A32] text-[#F7EFE6] shadow-md -translate-y-2 hover:bg-[#962127] active:scale-90 transition-transform cursor-pointer"
          title="Agregar Tarjeta"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Tab 3: Prensa */}
        <button
          onClick={() => onSelectTab('press')}
          className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors cursor-pointer active:scale-95 ${
            activeTab === 'press' ? 'text-[#7BA8A0]' : 'text-[#171512]/60 hover:text-[#171512]'
          }`}
        >
          <Newspaper className="w-5 h-5 mb-0.5" />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Prensa</span>
        </button>

        {/* Tab 4: Ajustes */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors cursor-pointer active:scale-95 ${
            activeTab === 'settings' ? 'text-[#B72A32]' : 'text-[#171512]/60 hover:text-[#171512]'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="font-label text-[9px] uppercase tracking-wider font-semibold">Ajustes</span>
        </button>

      </div>
    </div>
  );
};
