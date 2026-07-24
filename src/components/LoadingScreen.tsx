import React from 'react';

interface LoadingScreenProps {
  isLeaving: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLeaving }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black transition-opacity duration-500 ease-out ${
        isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <img
        src={`${import.meta.env.BASE_URL}nf-mark.png`}
        alt="Nora Hub"
        className="w-24 sm:w-28 h-auto animate-loading-mark"
        draggable={false}
      />

      <div className="relative h-0.5 w-28 sm:w-32 overflow-hidden rounded-full bg-white/15">
        <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/80 animate-loading-bar" />
      </div>
    </div>
  );
};
