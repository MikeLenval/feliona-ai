/**
 * ============================================
 * Feliona AI - Mobile Menu Component - MINIMAL FIX
 * 📱 Slide-in мобильное меню с glass morphism
 * 
 * FIXED ISSUES (5-8 минут):
 * ✅ P0: Removed duplicate analytics (use shared hook from Header)
 * ✅ P1: Added CSS fallback safety
 * 
 * SIZE: -8 lines (96% of original - UNDER LIMIT)
 * ============================================
 */

'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Типы из EIC системы
interface NavigationItem {
  name: string;
  href: string;
  label?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  // FIX 1: Accept analytics function from parent instead of duplicating
  onMenuAction?: (eventName: string, label: string) => void;
}

// Навигационные элементы (те же что в Header)
const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { name: 'Companions', href: '/companions', label: 'View AI companions' },
  { name: 'Relationships', href: '/#relationships', label: 'Relationship system' },
  { name: 'Pricing', href: '/#pricing', label: 'Pricing plans' },
  { name: 'Safety', href: '/#safety', label: 'Safety and privacy' },
] as const;

/**
 * Mobile Menu для Feliona AI
 * Slide-in меню с backdrop blur и glass morphism
 */
export function MobileMenu({ isOpen, onClose, className = "", onMenuAction }: MobileMenuProps) {
  const pathname = usePathname();

  // Проверка активного роута
  const isActiveLink = useCallback((href: string): boolean => {
    if (href.startsWith('/#')) {
      return pathname === '/' && href !== '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  // Обработчик клика по ссылке
  const handleLinkClick = useCallback((itemName: string) => {
    onMenuAction?.('nav_click', itemName.toLowerCase());
    onClose();
  }, [onClose, onMenuAction]);

  // Обработчик клика по backdrop
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onMenuAction?.('backdrop_click', 'close');
      onClose();
    }
  }, [onClose, onMenuAction]);

  // Обработчик Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onMenuAction?.('escape_key', 'close');
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body когда меню открыто
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onMenuAction]);

  // Focus trap для accessibility
  useEffect(() => {
    if (isOpen) {
      const menuElement = document.getElementById('mobile-menu');
      const focusableElements = menuElement?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Mobile Menu - FIX 2: CSS fallback safety */}
      <div 
        id="mobile-menu"
        className={`
          mobile-menu fixed top-0 right-0 h-full w-64 p-6 md:hidden z-50
          ${!className.includes('mobile-menu') ? 'bg-white/90 backdrop-blur-md border-l shadow-lg' : ''}
          ${isOpen ? 'open translate-x-0' : 'translate-x-full'}
          transition-transform duration-300 ease-in-out
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        
        {/* Menu Header */}
        <div className="mobile-menu-header flex justify-between items-center">
          <h3 
            id="mobile-menu-title"
            className="text-lg font-bold text-[var(--text-primary)]"
          >
            Menu
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--secondary-color)] rounded-md transition-colors"
            aria-label="Закрыть мобильное меню"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              height="24" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              width="24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav 
          className="flex flex-col gap-2 rounded-lg p-4"
          aria-label="Мобильная навигация"
        >
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = isActiveLink(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium transition-all py-2 px-3 rounded-md ${
                  isActive 
                    ? 'text-[var(--primary-color)] bg-[var(--glass-surface-strong)]' 
                    : 'text-[var(--text-primary)] hover:text-[var(--primary-color)] hover:bg-[var(--glass-surface)]'
                }`}
                onClick={() => handleLinkClick(item.name)}
                aria-label={item.label || `Перейти к ${item.name}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Additional Actions */}
        <div className="mt-8 space-y-4">
          
          {/* User Profile Link (если пользователь авторизован) */}
          <Link
            href="/profile"
            className="flex items-center gap-3 p-3 rounded-md bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] transition-colors"
            onClick={() => handleLinkClick('Profile')}
            aria-label="Перейти к профилю пользователя"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-[var(--text-primary)] font-medium">Profile</span>
          </Link>

          {/* Settings Link */}
          <Link
            href="/settings"
            className="flex items-center gap-3 p-3 rounded-md bg-[var(--glass-surface)] hover:bg-[var(--glass-surface-strong)] transition-colors"
            onClick={() => handleLinkClick('Settings')}
            aria-label="Перейти к настройкам"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-[var(--text-secondary)]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[var(--text-primary)] font-medium">Settings</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-center">
            <p className="text-xs text-[var(--text-tertiary)] mb-2">
              Feliona AI v1.0
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;