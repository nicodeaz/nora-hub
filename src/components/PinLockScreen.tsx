import React, { useState, useEffect, useRef } from 'react';
import { SignatureLogo } from './SignatureLogo';
import { WatercolorBackground } from './WatercolorBackground';
import { ArrowRight, Delete, Heart, ShieldAlert } from 'lucide-react';

interface PinLockScreenProps {
  correctPin: string;
  onSuccess: () => void;
  onOpenPublicTestimonials?: () => void;
}

const MAX_ATTEMPTS = 4;
const LOCKOUT_MS = 60_000; // 1 minute cooldown after 4 failed attempts
const ATTEMPTS_KEY = 'nora_hub_pin_attempts';
const LOCKED_UNTIL_KEY = 'nora_hub_pin_locked_until';

const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  onSuccess,
  onOpenPublicTestimonials,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lockedUntil, setLockedUntil] = useState<number>(() => {
    const saved = Number(localStorage.getItem(LOCKED_UNTIL_KEY) || 0);
    return saved > Date.now() ? saved : 0;
  });
  const [now, setNow] = useState<number>(Date.now());
  const attemptsRef = useRef<number>(Number(localStorage.getItem(ATTEMPTS_KEY) || 0));

  const isLocked = lockedUntil > now;

  // Tick the countdown while locked out
  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, [isLocked]);

  // Clear lock state once the cooldown expires
  useEffect(() => {
    if (lockedUntil && lockedUntil <= now) {
      setLockedUntil(0);
      localStorage.removeItem(LOCKED_UNTIL_KEY);
    }
  }, [lockedUntil, now]);

  const handleKeyPress = (num: string) => {
    if (isLocked) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      // Auto submit on 4 digits
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (isLocked) return;
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      attemptsRef.current = 0;
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKED_UNTIL_KEY);
      onSuccess();
      return;
    }

    const nextAttempts = attemptsRef.current + 1;
    attemptsRef.current = nextAttempts;
    localStorage.setItem(ATTEMPTS_KEY, String(nextAttempts));

    setError(true);

    if (nextAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      attemptsRef.current = 0;
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.setItem(LOCKED_UNTIL_KEY, String(until));
      setLockedUntil(until);
      setNow(Date.now());
      setErrorMessage('Demasiados intentos incorrectos. Portal bloqueado temporalmente.');
    } else {
      const remaining = MAX_ATTEMPTS - nextAttempts;
      setErrorMessage(`PIN incorrecto. Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'intento' : 'intentos'}.`);
    }

    setTimeout(() => setPin(''), 500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLocked) return;
    if (pin.length === 4) {
      verifyPin(pin);
    } else {
      setError(true);
      setErrorMessage('Ingresa los 4 dígitos del PIN.');
    }
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, correctPin, isLocked]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#F7EFE6] font-body">
      <WatercolorBackground />

      {/* Main Lock Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#F7EFE6]/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#171512]/10 shadow-xl text-center space-y-6">

        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center pt-2 pb-1">
          <SignatureLogo size="xl" />
        </div>

        {/* Welcome Tagline */}
        <p className="font-body text-sm sm:text-base text-[#171512]/80 italic">
          Ingresa tu PIN de 4 dígitos para acceder a tus accesos y archivos.
        </p>

        {isLocked ? (
          <div className="py-3 px-4 rounded-xl bg-[#B72A32]/10 border border-[#B72A32]/30 space-y-2 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-[#B72A32]">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-label text-xs uppercase tracking-wider font-bold">Portal bloqueado</span>
            </div>
            <p className="font-body text-xs text-[#171512]/70">
              Demasiados intentos incorrectos. Intenta nuevamente en{' '}
              <strong className="font-mono text-[#B72A32]">{formatCountdown(lockedUntil - now)}</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* PIN Display Dots */}
            <div className={`flex justify-center items-center gap-3 py-2 transition-transform duration-200 ${error ? 'animate-bounce text-[#B72A32]' : ''}`}>
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                      isFilled
                        ? 'bg-[#B72A32] border-[#B72A32] scale-110 shadow-sm'
                        : 'bg-transparent border-[#171512]/30'
                    }`}
                  />
                );
              })}
            </div>

            {/* Error Feedback */}
            {error && (
              <p className="text-xs font-label uppercase tracking-wider text-[#B72A32] font-semibold animate-fade-in">
                {errorMessage}
              </p>
            )}
          </>
        )}

        {/* On-Screen Keypad for Mobile / Touch */}
        <div className={`grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-2 transition-opacity ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              disabled={isLocked}
              className="h-12 rounded-xl bg-[#F7EFE6] hover:bg-[#F5D3C6]/50 active:scale-95 border border-[#171512]/15 text-lg font-label font-semibold text-[#171512] shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}
          <div aria-hidden="true" />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={isLocked}
            className="h-12 rounded-xl bg-[#F7EFE6] hover:bg-[#F5D3C6]/50 active:scale-95 border border-[#171512]/15 text-lg font-label font-semibold text-[#171512] shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLocked}
            className="h-12 rounded-xl bg-transparent hover:bg-[#B72A32]/10 text-[#B72A32] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            title="Borrar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={pin.length < 4 || isLocked}
            className={`w-full py-3.5 px-6 rounded-xl font-label text-xs uppercase tracking-[0.2em] font-semibold text-[#F7EFE6] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              pin.length === 4 && !isLocked
                ? 'bg-[#B72A32] hover:bg-[#962127] hover:shadow-lg active:scale-[0.99]'
                : 'bg-[#171512]/30 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Entrar al Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Public Testimonials Link for Students/Visitors */}
        {onOpenPublicTestimonials && (
          <div className="pt-3 border-t border-[#171512]/10">
            <button
              type="button"
              onClick={onOpenPublicTestimonials}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F7EFE6] hover:bg-[#F5D3C6]/60 border border-[#171512]/15 text-[#171512] font-label text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 text-[#B72A32] fill-[#B72A32]" />
              <span>Dejar una Reseña / Testimonio</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
