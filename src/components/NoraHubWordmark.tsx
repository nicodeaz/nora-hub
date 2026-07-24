import React from 'react';

interface NoraHubWordmarkProps {
  variant?: 'ink' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<NonNullable<NoraHubWordmarkProps['size']>, string> = {
  sm: 'text-base sm:text-lg',
  md: 'text-lg sm:text-xl',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
};

export const NoraHubWordmark: React.FC<NoraHubWordmarkProps> = ({
  variant = 'ink',
  className = '',
  size = 'md',
}) => {
  const inkColor = variant === 'white' ? 'text-white' : 'text-[#171512]';
  const accentColor = variant === 'white' ? 'text-[#F5D3C6]' : 'text-[#B72A32]';

  return (
    <div className={`inline-flex items-baseline gap-[0.35em] select-none font-label font-bold ${sizeClasses[size]} ${className}`}>
      <span className={inkColor}>Nora</span>
      <span className={accentColor}>Hub</span>
    </div>
  );
};
