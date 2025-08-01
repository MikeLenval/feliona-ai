"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/app/lib/utils";
import "../../types/platform/events";

export interface AgeGateProps {
  isOpen: boolean;
  onVerified: () => void;
  onDenied: () => void;
  className?: string;
}

/**
 * Age Gate Modal - точная копия из лендинга Feliona AI
 * Специальный модал для возрастной проверки 18+
 */
export const AgeGate: React.FC<AgeGateProps> = ({
  isOpen,
  onVerified,
  onDenied,
  className
}) => {
  // ✅ FIX: Ref для предотвращения race conditions при cleanup
  const isActiveRef = useRef(false);

  // ESC handling (для тестирования, в production может быть отключен)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      console.log("ESC pressed - Age gate visible");
      // В production ESC не должен закрывать Age Gate
    }
  }, []);

  // ✅ FIX: Исправлен race condition в event listeners
  useEffect(() => {
    if (!isOpen) {
      isActiveRef.current = false;
      return;
    }
    
    isActiveRef.current = true;
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      if (isActiveRef.current) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isOpen, handleKeyDown]);

  // ✅ FIX: Безопасная очистка body overflow без затирания других стилей
  useEffect(() => {
    if (!isOpen) return;
    
    const originalOverflow = document.body.style.overflow;
    const originalStyle = document.body.getAttribute('style');
    
    document.body.style.overflow = "hidden";
    
    return () => {
      // Восстанавливаем точное предыдущее состояние
      if (originalStyle) {
        document.body.setAttribute('style', originalStyle);
      } else {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isOpen]);

  // ✅ FIX: Вынесли gtag callbacks для предотвращения memory leaks
  const trackVerification = useCallback((isVerified: boolean) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const label = isVerified ? 'verified_18_plus' : 'denied_under_18';
      window.gtag('event', 'age_verification', {
        event_category: 'user_action',
        event_label: label
      });
    }
  }, []);

  // Обработчик кнопки "I am 18 or older"
  const handleEnterSite = useCallback(() => {
    sessionStorage.setItem('ageVerified', 'true');
    onVerified();
    trackVerification(true);
  }, [onVerified, trackVerification]);

  // Обработчик кнопки "I am under 18"
  const handleExitSite = useCallback(() => {
    sessionStorage.setItem('ageVerified', 'false');
    onDenied();
    trackVerification(false);
  }, [onDenied, trackVerification]);

  if (!isOpen) return null;

  const ageGateContent = (
    <div
      className={cn(
        "age-gate", // CSS класс из globals.css
        "fixed top-0 left-0 right-0 bottom-0",
        "bg-[rgba(18,17,24,0.95)] z-[100]",
        "flex items-center justify-center",
        "backdrop-blur-[10px]",
        "opacity-100 transition-opacity duration-300",
        className
      )}
    >
      <div className={cn(
        "age-gate-modal glass-morphism p-8 rounded-2xl text-center max-w-md mx-4",
        "transform scale-100 transition-transform duration-300"
      )}>
        <div className="mb-6">
          {/* Icon Circle */}
          <div className="w-16 h-16 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white mx-auto mb-4">
            <svg 
              fill="none" 
              height="32" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              width="32" 
              aria-hidden="true"
            >
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold mb-2 text-[var(--text-primary)]">
            Age Verification Required
          </h2>

          {/* Description */}
          <p className="text-[var(--text-secondary)] mb-4">
            This platform contains adult content and mature themes intended for users 18 years of age or older.
          </p>

          {/* Warning Box */}
          <div className="text-xs text-[var(--text-secondary)] mb-6 p-3 bg-[var(--secondary-color)]/30 rounded-lg">
            <strong>Warning:</strong> By continuing, you acknowledge that this site contains uncensored AI interactions, adult conversations, and mature content. You confirm that you are legally an adult in your jurisdiction.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary Button - I am 18 or older */}
          <button
            className={cn(
              "w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8",
              "bg-[var(--primary-color)] text-base font-bold text-white",
              "shadow-lg shadow-[var(--primary-color)]/20",
              "transition-all hover:bg-opacity-90 hover:scale-105",
              "focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]",
              "focus-visible:outline-none"
            )}
            onClick={handleEnterSite}
            aria-label="I am 18 or older - Enter site"
          >
            I am 18 or older
          </button>

          {/* Secondary Button - I am under 18 */}
          <button
            className={cn(
              "w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8",
              "bg-[var(--secondary-color)] text-base font-bold text-white",
              "transition-all hover:bg-opacity-80",
              "focus-visible:ring-2 focus-visible:ring-[var(--secondary-color)]",
              "focus-visible:outline-none"
            )}
            onClick={handleExitSite}
            aria-label="I am under 18 - Exit site"
          >
            I am under 18
          </button>
        </div>

        {/* Footer Text */}
        <div className="mt-4 text-xs text-[var(--text-secondary)]">
          Your choice will be remembered for this session
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(ageGateContent, document.body)
    : null;
};

export default AgeGate;