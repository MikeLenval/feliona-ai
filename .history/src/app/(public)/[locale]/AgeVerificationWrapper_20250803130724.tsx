"use client";

import React, { useState, useEffect } from 'react';
import { AgeGate } from '@/app/components/AgeGate';

interface AgeVerificationWrapperProps {
  locale: string;
  children: React.ReactNode;
}

/**
 * AgeVerificationWrapper - оболочка для возрастной верификации
 * Показывает AgeGate при первом посещении и сохраняет результат в localStorage
 */
export function AgeVerificationWrapper({ locale, children }: AgeVerificationWrapperProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isAgeGateOpen, setIsAgeGateOpen] = useState(false);

  useEffect(() => {
    // Проверяем localStorage при загрузке
    const verified = localStorage.getItem('age-verified');
    if (verified === 'true') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setIsAgeGateOpen(true);
    }
  }, []);

  const handleVerified = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVerified(true);
    setIsAgeGateOpen(false);
  };

  const handleDenied = () => {
    localStorage.setItem('age-verified', 'false');
    setIsVerified(false);
    setIsAgeGateOpen(false);
    // Редирект на безопасную страницу
    window.location.href = 'https://www.google.com';
  };

  // Показываем loading пока проверяем localStorage
  if (isVerified === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-brand-950">
        <div className="animate-pulse text-brand-600 dark:text-brand-400">
          Loading...
        </div>
      </div>
    );
  }

  // Если не верифицирован и отказался - не показываем контент
  if (!isVerified && !isAgeGateOpen) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-brand-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Access Denied
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            You must be 18 or older to access this content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Основной контент - показываем только если верифицирован */}
      {isVerified && children}
      
      {/* AgeGate Modal */}
      <AgeGate
        isOpen={isAgeGateOpen}
        onVerified={handleVerified}
        onDenied={handleDenied}
      />
    </>
  );
}
