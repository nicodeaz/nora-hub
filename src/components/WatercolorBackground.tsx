import React from 'react';
import { Sparkle } from './Sparkle';

export const WatercolorBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Rosa Spot (Top-Right) - the radial-gradient already fades to transparent,
          so no blur filter is needed; that would just force a repaint every frame
          of the animation for no visible gain. */}
      <div className="absolute -top-24 -right-24 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full watercolor-spot-pink opacity-70 animate-watercolor-1" />

      {/* Verde Azulado Spot (Bottom-Left) */}
      <div className="absolute -bottom-32 -left-20 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full watercolor-spot-teal opacity-60 animate-watercolor-2" />

      {/* Dorado Spot (Center-Right Soft Accent) */}
      <div className="absolute top-1/3 -right-28 w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full watercolor-spot-gold opacity-50 animate-watercolor-3" />

      {/* Scattered Organic Sparkles */}
      <div className="absolute top-[12%] left-[8%] opacity-60">
        <Sparkle color="red" size={16} delay="0s" />
      </div>
      <div className="absolute top-[28%] right-[10%] opacity-70">
        <Sparkle color="gold" size={20} delay="1.2s" />
      </div>
      <div className="absolute bottom-[20%] left-[12%] opacity-60">
        <Sparkle color="ink" size={14} delay="0.8s" />
      </div>
      <div className="absolute bottom-[10%] right-[15%] opacity-50">
        <Sparkle color="teal" size={18} delay="2.1s" />
      </div>

      {/* Scattered Subtle Ink Speckles */}
      <div className="absolute top-[40%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#171512]/20" />
      <div className="absolute top-[65%] right-[28%] w-2 h-2 rounded-full bg-[#171512]/15" />
      <div className="absolute bottom-[35%] left-[45%] w-1 h-1 rounded-full bg-[#B72A32]/25" />
    </div>
  );
};
