import React from 'react';
import { HubCardItem } from '../types';
import { DynamicHubIcon } from './DynamicHubIcon';
import { Sparkle } from './Sparkle';
import { ExternalLink, Pin, MoreVertical, Edit2, Trash2, Copy, Check } from 'lucide-react';

interface HubCardProps {
  card: HubCardItem;
  onAction: (card: HubCardItem) => void;
  onTogglePin: (id: string) => void;
  onEditCard: (card: HubCardItem) => void;
  onDeleteCard: (id: string) => void;
}

export const HubCard: React.FC<HubCardProps> = ({
  card,
  onAction,
  onTogglePin,
  onEditCard,
  onDeleteCard,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Accent Styles Map
  const accentStyles = {
    red: {
      border: 'border-[#B72A32]/30 hover:border-[#B72A32]',
      bgIcon: 'bg-[#B72A32]/10 text-[#B72A32]',
      badge: 'bg-[#B72A32]/10 text-[#B72A32]',
      indicator: 'bg-[#B72A32]',
    },
    pink: {
      border: 'border-[#F5D3C6] hover:border-[#B72A32]/60',
      bgIcon: 'bg-[#F5D3C6]/60 text-[#B72A32]',
      badge: 'bg-[#F5D3C6]/60 text-[#171512]',
      indicator: 'bg-[#F5D3C6]',
    },
    teal: {
      border: 'border-[#7BA8A0]/40 hover:border-[#7BA8A0]',
      bgIcon: 'bg-[#7BA8A0]/20 text-[#2C5E56]',
      badge: 'bg-[#7BA8A0]/20 text-[#2C5E56]',
      indicator: 'bg-[#7BA8A0]',
    },
    gold: {
      border: 'border-[#E8B34E]/40 hover:border-[#E8B34E]',
      bgIcon: 'bg-[#E8B34E]/20 text-[#8C5D07]',
      badge: 'bg-[#E8B34E]/20 text-[#8C5D07]',
      indicator: 'bg-[#E8B34E]',
    },
    ink: {
      border: 'border-[#171512]/20 hover:border-[#171512]',
      bgIcon: 'bg-[#171512]/10 text-[#171512]',
      badge: 'bg-[#171512]/10 text-[#171512]',
      indicator: 'bg-[#171512]',
    },
  };

  const currentAccent = accentStyles[card.accentColor] || accentStyles.red;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(card.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  return (
    <div
      onClick={() => onAction(card)}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 border ${currentAccent.border} shadow-md hover:shadow-lg transition-[box-shadow,transform,border-color] duration-300 cursor-pointer transform hover:-translate-y-1 select-none`}
    >
      {/* Top Accent Indicator Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${currentAccent.indicator}`} />

      {/* Card Header: Icon, Badge, Menu */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${currentAccent.bgIcon} transition-transform duration-300 group-hover:scale-105 shadow-xs`}>
            <DynamicHubIcon name={card.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full font-label text-[10px] uppercase tracking-wider font-semibold ${currentAccent.badge}`}>
              {card.badgeText || card.category}
            </span>
          </div>
        </div>

        {/* Pin & Options Controls */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onTogglePin(card.id)}
            className={`p-2.5 -m-0.5 rounded-lg transition-colors cursor-pointer touch-manipulation ${
              card.isPinned
                ? 'text-[#B72A32] bg-[#B72A32]/10'
                : 'text-[#171512]/30 hover:text-[#171512] hover:bg-[#171512]/5'
            }`}
            title={card.isPinned ? 'Fijado al inicio' : 'Fijar tarjeta'}
          >
            <Pin className={`w-4 h-4 ${card.isPinned ? 'fill-[#B72A32]' : ''}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 -m-0.5 rounded-lg text-[#171512]/40 hover:text-[#171512] hover:bg-[#171512]/5 transition-colors cursor-pointer touch-manipulation"
              title="Opciones"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-[#F7EFE6] border border-[#171512]/15 shadow-lg p-1.5 space-y-1 font-body text-xs">
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#171512]/5 text-[#171512] flex items-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#171512]/60" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEditCard(card);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-lg hover:bg-[#171512]/5 text-[#171512] flex items-center gap-2.5 cursor-pointer touch-manipulation"
                >
                  <Edit2 className="w-4 h-4 text-[#171512]/60" />
                  <span>Editar Tarjeta</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (window.confirm(`¿Estás segura de eliminar la tarjeta "${card.title}"?`)) {
                      onDeleteCard(card.id);
                    }
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-lg hover:bg-[#B72A32]/10 text-[#B72A32] flex items-center gap-2.5 cursor-pointer font-medium touch-manipulation"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Tarjeta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body: Title & Description */}
      <div className="space-y-2 mb-4">
        <h3 className="font-label text-base sm:text-lg font-bold text-[#171512] tracking-wide group-hover:text-[#B72A32] transition-colors flex items-center gap-1.5">
          <span>{card.title}</span>
          {card.actionType === 'link' && (
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#B72A32] inline-block" />
          )}
        </h3>
        <p className="font-body text-xs sm:text-sm text-[#171512]/75 leading-relaxed">
          {card.description}
        </p>
      </div>

      {/* Card Footer: Category & Direct Action Link */}
      <div className="pt-2 border-t border-[#171512]/10 flex items-center justify-between text-xs font-label text-[#171512]/60">
        <span className="uppercase tracking-widest text-[10px] font-semibold">
          {card.category}
        </span>
        <span className="group-hover:translate-x-1 transition-transform text-[#B72A32] font-semibold flex items-center gap-1">
          Abrir →
        </span>
      </div>
    </div>
  );
};
