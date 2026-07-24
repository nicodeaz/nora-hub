import React from 'react';
import { NoraHubWordmark } from './NoraHubWordmark';

interface LoadingScreenProps {
  isLeaving: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLeaving }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black transition-opacity duration-[250ms] ease-out ${
        isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="animate-loading-mark">
        <NoraHubWordmark variant="white" size="xl" />
      </div>

      <div className="relative h-0.5 w-28 sm:w-32 overflow-hidden rounded-full bg-white/15">
        <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/80 animate-loading-bar" />
      </div>
    </div>
  );
};
