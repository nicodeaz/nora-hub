import React, { useState, useEffect, useRef } from 'react';
import { NoraHubWordmark } from './NoraHubWordmark';
import { WatercolorBackground } from './WatercolorBackground';
import { Delete, Heart, ShieldAlert } from 'lucide-react';

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

const KEYPAD_BUTTON =
  'flex items-center justify-center w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full bg-[#171512]/[0.05] hover:bg-[#171512]/10 active:scale-90 border border-[#171512]/10 text-[#171512] font-label font-medium text-2xl sm:text-3xl tracking-normal normal-case transition-[background-color,transform] duration-150 cursor-pointer touch-manipulation';

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
  const [now, setNow] = useState<Date>(new Date());
  const attemptsRef = useRef<number>(Number(localStorage.getItem(ATTEMPTS_KEY) || 0));

  const isLocked = lockedUntil > now.getTime();

  // Live clock, ticking every second for as long as the lock screen is shown.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Clear lock state once the cooldown expires
  useEffect(() => {
    if (lockedUntil && lockedUntil <= now.getTime()) {
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

      // Auto submit on 4 digits, like a native lock screen
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
      setErrorMessage('Demasiados intentos incorrectos. Portal bloqueado temporalmente.');
    } else {
      const remaining = MAX_ATTEMPTS - nextAttempts;
      setErrorMessage(`PIN incorrecto. Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'intento' : 'intentos'}.`);
    }

    setTimeout(() => setPin(''), 500);
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, correctPin, isLocked]);

  const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="fixed inset-0 w-full h-full bg-[#F7EFE6] font-body overflow-hidden select-none">
      <WatercolorBackground />

      <div
        className="relative z-10 flex flex-col h-full w-full px-6"
        style={{
          paddingTop: 'max(1.75rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Top: small wordmark, like the carrier label on iOS */}
        <div className="flex justify-center shrink-0">
          <NoraHubWordmark size="sm" className="opacity-70" />
        </div>

        {/* Clock + date + PIN status, vertically centered like an iOS lock screen */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 min-h-0">
          <div className="text-center">
            <p
              className="font-label leading-none text-[#171512] text-[4.5rem] sm:text-8xl"
              style={{ fontWeight: 300 }}
            >
              {timeStr}
            </p>
            <p className="font-label text-xs sm:text-sm tracking-widest text-[#171512]/60 mt-2 capitalize">
              {dateStr}
            </p>
          </div>

          {isLocked ? (
            <div className="flex flex-col items-center gap-2 text-center animate-fade-in px-4">
              <ShieldAlert className="w-5 h-5 text-[#B72A32]" />
              <p className="font-label text-xs uppercase tracking-wider font-bold text-[#B72A32]">Portal bloqueado</p>
              <p className="font-body text-xs text-[#171512]/70">
                Intenta nuevamente en{' '}
                <strong className="font-mono text-[#B72A32]">{formatCountdown(lockedUntil - now.getTime())}</strong>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={`flex items-center gap-3.5 ${error ? 'animate-shake' : ''}`}>
                {[0, 1, 2, 3].map((index) => {
                  const isFilled = pin.length > index;
                  return (
                    <div
                      key={index}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-150 border-2 ${
                        isFilled
                          ? `${error ? 'bg-[#B72A32] border-[#B72A32]' : 'bg-[#171512] border-[#171512]'} scale-110`
                          : 'bg-transparent border-[#171512]/30'
                      }`}
                    />
                  );
                })}
              </div>
              <p className={`font-label text-[11px] uppercase tracking-wider font-semibold h-4 ${error ? 'text-[#B72A32]' : 'text-[#171512]/50'}`}>
                {error ? errorMessage : 'Ingresa tu PIN'}
              </p>
            </div>
          )}
        </div>

        {/* iOS-style circular keypad */}
        <div className={`shrink-0 grid grid-cols-3 gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4 justify-items-center mx-auto transition-opacity ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              disabled={isLocked}
              className={KEYPAD_BUTTON}
            >
              {num}
            </button>
          ))}
          <div aria-hidden="true" />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={isLocked}
            className={KEYPAD_BUTTON}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLocked}
            className="flex items-center justify-center w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] text-[#171512]/60 hover:text-[#B72A32] cursor-pointer active:scale-90 transition-[color,transform] touch-manipulation"
            title="Borrar dígito"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom: minimal utility link, like iOS's "Emergency" text */}
        <div className="shrink-0 flex justify-center pt-6">
          {onOpenPublicTestimonials && (
            <button
              type="button"
              onClick={onOpenPublicTestimonials}
              className="font-label text-[11px] uppercase tracking-wider font-semibold text-[#171512]/50 hover:text-[#B72A32] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Heart className="w-3 h-3" />
              <span>Dejar una Reseña / Testimonio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
