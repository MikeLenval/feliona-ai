"use client";

import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useId,
  useMemo,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/app/lib/utils";

/**
 * Варианты модалов для Feliona AI
 */
export type ModalVariant = 
  | "default"      // Обычный модал
  | "age-gate"     // Age Gate специальный стиль
  | "companion"    // Модал выбора компаньона
  | "glass";       // Glass morphism стиль

/**
 * Размеры модалов (из лендинга)
 */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  variant?: ModalVariant;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  priority?: "low" | "medium" | "high" | "critical"; // Для Age Gate
}

// ✅ FIX 1: Константы вынесены из компонента для предотвращения пересоздания
const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[95vw] md:max-w-4xl",
};

const Z_INDEX_CLASSES = {
  low: "z-40",
  medium: "z-50", 
  high: "z-60",
  critical: "z-[100]" // Для Age Gate
};

const VARIANT_CLASSES = {
  default: cn(
    "glass-morphism", // Класс из globals.css
    "border border-white/15"
  ),
  
  "age-gate": cn(
    "glass-morphism",
    "border border-white/15", 
    "bg-[var(--age-gate-bg)]", // Специальный фон из globals.css
    "backdrop-blur-[20px]"
  ),
  
  companion: cn(
    "glass-morphism",
    "border border-[var(--primary-color)]/20",
    "shadow-[0_0_30px_rgba(98,71,234,0.2)]"
  ),
  
  glass: cn(
    "glass-morphism",
    "border border-white/10"
  )
};

/**
 * Модал в стиле Feliona AI
 * Поддерживает Age Gate и другие специальные варианты
 */
export const Modal = forwardRef<ElementRef<"div">, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      variant = "default",
      size = "md",
      closeOnOverlayClick = true,
      closeOnEsc = true,
      showCloseButton = true,
      footer,
      children,
      className,
      initialFocusRef,
      priority = "medium",
      ...props
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const headerId = useId();
    const descId = useId();

    // Мемоизированные обработчики
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose();
      }
    }, [onClose, closeOnEsc]);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
          onClose();
        }
      },
      [closeOnOverlayClick, onClose]
    );

    // Escape key handling
    useEffect(() => {
      if (!isOpen) return;
      
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, handleKeyDown]);

    // Focus trap
    useEffect(() => {
      if (!isOpen || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      // ✅ FIX 2: Добавлен cleanup для focus trap событий
      dialogRef.current.addEventListener("keydown", handleFocusTrap);
      return () => {
        dialogRef.current?.removeEventListener("keydown", handleFocusTrap);
      };
    }, [isOpen]);

    // Initial focus
    useEffect(() => {
      if (!isOpen) return;
      
      const timer = setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (dialogRef.current) {
          const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [isOpen, initialFocusRef]);

    // Body overflow control
    useEffect(() => {
      if (isOpen) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [isOpen]);

    // Анимационные классы (CSS instead of framer-motion)
    const animationClasses = useMemo(() => ({
      overlay: cn(
        "fixed inset-0 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      ),
      modal: cn(
        "transition-all duration-300",
        isOpen 
          ? "opacity-100 scale-100 translate-y-0" 
          : "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )
    }), [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
      <>
        {/* Overlay */}
        <div
          className={cn(
            animationClasses.overlay,
            "bg-black/80 backdrop-blur-sm",
            Z_INDEX_CLASSES[priority]
          )}
          aria-hidden="true"
          onClick={handleOverlayClick}
        />

        {/* Modal Container */}
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 flex items-center justify-center p-4",
            Z_INDEX_CLASSES[priority],
            className
          )}
          {...props}
        >
          <div
            ref={dialogRef}
            className={cn(
              "w-full outline-none relative",
              SIZE_CLASSES[size],
              animationClasses.modal
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? headerId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className={cn(
              "relative max-h-[90vh] overflow-hidden flex flex-col rounded-2xl",
              VARIANT_CLASSES[variant]
            )}>
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between p-6 pb-4">
                  <div className="flex-1">
                    {title && (
                      <h2 
                        id={headerId} 
                        className="text-2xl font-bold text-[var(--text-primary)] mb-2"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p 
                        id={descId} 
                        className="text-[var(--text-secondary)] leading-relaxed"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {/* Close Button */}
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className={cn(
                        "ml-4 p-2 rounded-md",
                        "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                        "hover:bg-white/5 transition-all duration-200",
                        "focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]",
                        "focus-visible:outline-none"
                      )}
                      aria-label="Close modal"
                    >
                      <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="border-t border-white/10 p-6 pt-4">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );

    return typeof document !== "undefined"
      ? createPortal(modalContent, document.body)
      : null;
  }
);

Modal.displayName = "Modal";

// Modal Footer Component
export const ModalFooter = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex items-center justify-end gap-4", className)} 
      {...props} 
    />
  )
);

ModalFooter.displayName = "ModalFooter";

export default Modal;