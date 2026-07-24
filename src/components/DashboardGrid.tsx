import React, { useState } from 'react';
import { HubCardItem, CardCategory } from '../types';
import { HubCard } from './HubCard';
import { Sparkle } from './Sparkle';
import { Plus, Pin, Filter, Compass } from 'lucide-react';

interface DashboardGridProps {
  cards: HubCardItem[];
  onCardAction: (card: HubCardItem) => void;
  onTogglePin: (id: string) => void;
  onEditCard: (card: HubCardItem) => void;
  onDeleteCard: (id: string) => void;
  onOpenAddCard: () => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  cards,
  onCardAction,
  onTogglePin,
  onEditCard,
  onDeleteCard,
  onOpenAddCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Filter Cards by Selected Category
  const filteredCards = cards.filter(
    (card) => selectedCategory === 'todos' || card.category === selectedCategory
  );

  const pinnedCards = filteredCards.filter((card) => card.isPinned);
  const unpinnedCards = filteredCards.filter((card) => !card.isPinned);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'principal', label: 'Principal' },
    { id: 'gestion', label: 'Gestión' },
    { id: 'prensa', label: 'Prensa' },
    { id: 'comunidad', label: 'Comunidad' },
    { id: 'recursos', label: 'Recursos' },
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-24 md:pb-12">
      
      {/* Category Filter Tabs - Mobile Scrollable Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Filter className="w-4 h-4 text-[#171512]/40 hidden sm:block shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-2 px-3.5 sm:px-4 rounded-xl font-label text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 touch-manipulation ${
                selectedCategory === cat.id
                  ? 'bg-[#B72A32] text-[#F7EFE6] shadow-xs'
                  : 'bg-[#F7EFE6] hover:bg-[#F5D3C6]/50 text-[#171512]/70 border border-[#171512]/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="font-label text-xs text-[#171512]/50 font-medium hidden sm:block shrink-0">
          {filteredCards.length} {filteredCards.length === 1 ? 'acceso' : 'accesos'}
        </p>
      </div>

      {/* Pinned Cards Section (if search/category contains pinned cards) */}
      {pinnedCards.length > 0 && selectedCategory === 'todos' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-label text-xs uppercase tracking-[0.2em] text-[#B72A32] font-bold">
            <Pin className="w-4 h-4 fill-[#B72A32]" />
            <span>Accesos Destacados</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pinnedCards.map((card) => (
              <HubCard
                key={card.id}
                card={card}
                onAction={onCardAction}
                onTogglePin={onTogglePin}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="space-y-4">
        {pinnedCards.length > 0 && selectedCategory === 'todos' && (
          <div className="font-label text-xs uppercase tracking-[0.2em] text-[#171512]/50 font-bold pt-2">
            <span>Todos los Recursos</span>
          </div>
        )}

        {filteredCards.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#171512]/10 shadow-sm space-y-4">
            <Compass className="w-12 h-12 text-[#B72A32]/40 mx-auto animate-pulse" />
            <h3 className="font-label text-base uppercase tracking-wider font-bold text-[#171512]">
              No se encontraron accesos
            </h3>
            <p className="font-body text-xs text-[#171512]/60 max-w-md mx-auto">
              No hay tarjetas en esta categoría todavía. Agrega una tarjeta personalizada.
            </p>
            <button
              onClick={onOpenAddCard}
              className="py-2.5 px-5 rounded-xl bg-[#B72A32] hover:bg-[#962127] text-[#F7EFE6] font-label text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Tarjeta</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {(selectedCategory === 'todos' ? unpinnedCards : filteredCards).map((card) => (
              <HubCard
                key={card.id}
                card={card}
                onAction={onCardAction}
                onTogglePin={onTogglePin}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            ))}

            {/* Quick Add Card Placeholder Button in Grid */}
            <div
              onClick={onOpenAddCard}
              className="group flex flex-col items-center justify-center min-h-[180px] rounded-2xl bg-[#F7EFE6]/50 hover:bg-[#F5D3C6]/30 border-2 border-dashed border-[#171512]/20 hover:border-[#B72A32] p-6 text-center cursor-pointer transition-all duration-300 select-none space-y-2"
            >
              <div className="p-3 rounded-full bg-[#B72A32]/10 text-[#B72A32] group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-label text-xs uppercase tracking-widest font-bold text-[#171512]">
                Agregar Tarjeta
              </p>
              <p className="font-body text-[11px] text-[#171512]/50">
                Crea un nuevo acceso personalizado
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
