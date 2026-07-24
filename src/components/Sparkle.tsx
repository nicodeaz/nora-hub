import React from 'react';

interface SparkleProps {
  color?: 'red' | 'ink' | 'gold' | 'pink' | 'teal';
  size?: number; // in pixels
  className?: string;
  delay?: string;
}

export const Sparkle: React.FC<SparkleProps> = ({
  color = 'red',
  size = 18,
  className = '',
  delay,
}) => {
  const colorMap = {
    red: '#B72A32',
    ink: '#171512',
    gold: '#E8B34E',
    pink: '#F5D3C6',
    teal: '#7BA8A0',
  };

  const fillColor = colorMap[color] || colorMap.red;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fillColor}
      className={`inline-block animate-sparkle pointer-events-none ${className}`}
      style={{ animationDelay: delay }}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
};
