import React from 'react';

interface SignatureLogoProps {
  variant?: 'ink' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'center' | 'left';
}

const sizeClasses: Record<NonNullable<SignatureLogoProps['size']>, string> = {
  sm: 'w-28 sm:w-32',
  md: 'w-36 sm:w-44 md:w-48',
  lg: 'w-44 sm:w-52 md:w-60',
  xl: 'w-52 sm:w-64 md:w-72',
};

export const SignatureLogo: React.FC<SignatureLogoProps> = ({
  variant = 'ink',
  className = '',
  size = 'md',
  align = 'center',
}) => {
  const src = `${import.meta.env.BASE_URL}${variant === 'white' ? 'logo-nora-white.png' : 'logo-nora-black.png'}`;
  const alignClass = align === 'left' ? 'items-start' : 'items-center';

  return (
    <div className={`inline-flex flex-col select-none ${alignClass} ${className}`}>
      <img
        src={src}
        alt="Nora Filmus"
        className={`${sizeClasses[size]} h-auto`}
        draggable={false}
      />
    </div>
  );
};
