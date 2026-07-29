import React, { useState, useEffect, useRef } from 'react';
import { NoraHubWordmark } from './NoraHubWordmark';
import { WatercolorBackground } from './WatercolorBackground';
import { Delete, Heart, ShieldAlert, WifiOff } from 'lucide-react';
import { PIN_GUARD_URL, getDeviceId } from '../lib/backendConfig';

interface PinLockScreenProps {
  onSuccess: () => void;
  onOpenPublicTestimonials?: () => void;
}

const PIN_LENGTH = 6;

const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const KEYPAD_BUTTON =
  'flex items-center justify-center w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full bg-[#171512]/[0.05] hover:bg-[#171512]/10 active:scale-90 border border-[#171512]/10 text-[#171512] font-label font-medium text-2xl sm:text-3xl tracking-normal normal-case transition-[background-color,transform] duration-150 cursor-pointer touch-manipulation disabled:opacity-40 disabled:pointer-events-none';

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  onSuccess,
  onOpenPublicTestimonials,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [offline, setOffline] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());
  const requestSeq = useRef<number>(0);

  const isLocked = lockedUntil > now.getTime();

  // Live clock, ticking every second for as long as the lock screen is shown.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Clear local lock display once the cooldown expires; the next attempt
  // re-validates against the server, which is the real authority.
  useEffect(() => {
    if (lockedUntil && lockedUntil <= now.getTime()) {
      setLockedUntil(0);
    }
  }, [lockedUntil, now]);

  const verifyPin = async (enteredPin: string) => {
    const seq = ++requestSeq.current;
    setIsVerifying(true);
    setOffline(false);

    let response: Response;
    try {
      response = await fetch(PIN_GUARD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin, deviceId: getDeviceId() }),
      });
    } catch {
      if (seq !== requestSeq.current) return;
      setError(true);
      setOffline(true);
      setErrorMessage('Sin conexión. Necesitás internet para desbloquear el Hub.');
      setIsVerifying(false);
      setTimeout(() => setPin(''), 500);
      return;
    }

    if (seq !== requestSeq.current) return;

    let body: { success?: boolean; message?: string; attemptsRemaining?: number; lockedUntil?: string } = {};
    try {
      body = await response.json();
    } catch {
      // Non-JSON response — treated as a generic failure below.
    }

    if (response.status === 423) {
      const until = body.lockedUntil ? new Date(body.lockedUntil).getTime() : Date.now() + 60_000;
      setLockedUntil(until);
      setError(true);
      setErrorMessage(body.message || 'Demasiados intentos incorrectos. Portal bloqueado temporalmente.');
      setIsVerifying(false);
      setPin('');
      return;
    }

    if (response.ok && body.success === true) {
      setIsVerifying(false);
      onSuccess();
      return;
    }

    setError(true);
    const remaining = typeof body.attemptsRemaining === 'number' ? body.attemptsRemaining : null;
    setErrorMessage(
      remaining !== null
        ? `PIN incorrecto. Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'intento' : 'intentos'}.`
        : body.message || 'PIN incorrecto.'
    );
    setIsVerifying(false);
    setTimeout(() => setPin(''), 500);
  };

  const handleKeyPress = (num: string) => {
    if (isLocked || isVerifying) return;
    if (pin.length < PIN_LENGTH) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === PIN_LENGTH) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (isLocked || isVerifying) return;
    setPin((prev) => prev.slice(0, -1));
    setError(false);
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
  }, [pin, isLocked, isVerifying]);

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
              <div className={`flex items-center gap-2.5 sm:gap-3 ${error ? 'animate-shake' : ''}`}>
                {Array.from({ length: PIN_LENGTH }, (_, index) => {
                  const isFilled = pin.length > index;
                  return (
                    <div
                      key={index}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-150 border-2 ${
                        isFilled
                          ? `${error ? 'bg-[#B72A32] border-[#B72A32]' : 'bg-[#171512] border-[#171512]'} scale-110`
                          : 'bg-transparent border-[#171512]/30'
                      }`}
                    />
                  );
                })}
              </div>
              <p className={`font-label text-[11px] uppercase tracking-wider font-semibold h-4 flex items-center gap-1.5 ${error ? 'text-[#B72A32]' : 'text-[#171512]/50'}`}>
                {offline && <WifiOff className="w-3 h-3" />}
                {isVerifying ? 'Verificando...' : error ? errorMessage : 'Ingresa tu PIN'}
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
              disabled={isLocked || isVerifying}
              className={KEYPAD_BUTTON}
            >
              {num}
            </button>
          ))}
          <div aria-hidden="true" />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={isLocked || isVerifying}
            className={KEYPAD_BUTTON}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLocked || isVerifying}
            className="flex items-center justify-center w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] text-[#171512]/60 hover:text-[#B72A32] cursor-pointer active:scale-90 transition-[color,transform] touch-manipulation disabled:opacity-40 disabled:pointer-events-none"
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
