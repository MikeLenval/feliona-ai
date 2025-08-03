"use client";

import { forwardRef } from "react";
import { cn } from "@/app/lib/utils";
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";

/**
 * Варианты кнопок для Feliona AI (строго из лендинга)
 */
export type ButtonVariant = 
  | "primary"           // Основная фиолетовая кнопка
  | "secondary"         // Прозрачная с border
  | "outline"           // Обводка без заливки
  | "feliona"           // С glow эффектом и градиентом  
  | "pulse"             // С pulse анимацией
  | "cta-primary"       // Главные CTA кнопки
  | "cta-secondary"     // Вторичные CTA кнопки
  | "glass";            // Glass morphism

/**
 * Размеры кнопок (из лендинга)
 */
export type ButtonSize = "sm" | "md" | "lg" | "xl";

/**
 * Пропсы кнопки Feliona AI
 */
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children?: ReactNode;
  "aria-label"?: string;
  "data-testid"?: string;
}

// Loading spinner SVG (переиспользуемая константа)
const LOADING_SPINNER_SVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    focusable="false"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Кнопка в стиле Feliona AI
 * Использует дизайн-систему из globals.css
 */
export const Button = forwardRef<ElementRef<"button">, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      icon,
      iconPosition = "left",
      loading = false,
      className,
      disabled,
      children,
      "aria-label": ariaLabel,
      "data-testid": testId,
      tabIndex,
      ...props
    },
    ref
  ) => {
    // Базовые классы (Feliona AI стиль)
    const baseClasses = cn(
      "relative inline-flex items-center justify-center gap-2",
      "font-semibold transition-all duration-300", // Feliona AI использует 300ms
      "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[var(--background-color)]",
      "disabled:opacity-50 disabled:pointer-events-none",
      "active:scale-[0.97]",
      "cursor-pointer touch-action-manipulation", // Для мобильных
      fullWidth && "w-full"
    );

    // Размеры (из лендинга Feliona AI)
    const sizeClasses = {
      sm: "px-4 py-2 text-sm rounded-lg min-h-[36px]",        // Кнопки в карточках
      md: "px-6 py-3 text-base rounded-lg min-h-[44px]",      // Обычные кнопки
      lg: "px-8 py-4 text-lg rounded-xl min-h-[52px]",       // CTA кнопки
      xl: "px-8 py-4 text-xl rounded-full min-h-[60px]"      // Hero CTA кнопки
    };

    // Варианты стилей (строго из лендинга)
    const variantClasses = {
      // Основная фиолетовая кнопка (#6247ea)
      primary: cn(
        "bg-[var(--primary-color)] text-white font-bold",
        "shadow-lg shadow-[var(--primary-color)]/20",
        "hover:bg-opacity-90 hover:scale-105",
        "active:scale-95"
      ),

      // Прозрачная кнопка с border (из лендинга)
      secondary: cn(
        "bg-[var(--secondary-color)] text-white font-medium",
        "border border-[var(--secondary-color)]",
        "hover:bg-opacity-80",
        "active:bg-opacity-90"
      ),

      // Outline кнопка (только обводка)
      outline: cn(
        "bg-transparent text-[var(--primary-color)] font-medium",
        "border border-[var(--primary-color)]",
        "hover:bg-[var(--primary-color)] hover:text-white",
        "active:bg-opacity-90"
      ),

      // Feliona brand кнопка с glow
      feliona: cn(
        "bg-gradient-to-r from-[var(--primary-color)] to-[#8b7cf6]",
        "text-white font-bold",
        "shadow-lg shadow-[var(--primary-color)]/20",
        "hover:shadow-[0_0_30px_rgba(98,71,234,0.3)]",
        "hover:scale-105",
        "active:scale-95"
      ),

      // Pulse кнопка (для главных CTA)
      pulse: cn(
        "bg-[var(--primary-color)] text-white font-bold",
        "shadow-lg shadow-[var(--primary-color)]/20",
        "pulse-button", // CSS класс из globals.css
        "hover:bg-opacity-90"
      ),

      // Главная CTA кнопка (из Hero)
      "cta-primary": cn(
        "bg-white/10 backdrop-blur-md border border-white/20",
        "text-white font-bold",
        "shadow-lg shadow-[var(--primary-color)]/20",
        "hover:bg-white/20",
        "active:bg-white/15"
      ),

      // Вторичная CTA кнопка  
      "cta-secondary": cn(
        "bg-transparent border border-white/20",
        "text-white font-medium",
        "backdrop-filter backdrop-blur-md",
        "hover:bg-white/5 hover:border-white/30",
        "active:bg-white/10"
      ),

      // Glass morphism кнопка
      glass: cn(
        "glass-morphism", // Класс из globals.css
        "text-white font-medium",
        "hover:bg-white/5",
        "active:bg-white/10"
      )
    };

    // Спиннер загрузки с правильными размерами
    const spinner = loading ? (
      <span
        className={cn(
          "animate-spin",
          size === "sm" ? "w-3 h-3" : 
          size === "md" ? "w-4 h-4" : 
          size === "lg" ? "w-5 h-5" : "w-6 h-6"
        )}
        aria-hidden={!loading}
        aria-live={loading ? "polite" : undefined}
      >
        {LOADING_SPINNER_SVG}
      </span>
    ) : null;

    // Содержимое кнопки
    const buttonContent = (
      <>
        {loading && iconPosition === "left" && spinner}
        {!loading && icon && iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!loading && icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {loading && iconPosition === "right" && spinner}
      </>
    );

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={tabIndex}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={ariaLabel}
        aria-disabled={disabled || loading}
        data-testid={testId}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;