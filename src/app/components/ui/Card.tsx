"use client";

import React, {
  forwardRef,
  useMemo,
  type ReactNode,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

// === КОНСТАНТЫ (вынесенные из магических чисел) ===
const ANIMATION_DELAY_BASE_MS = 150;
const DEFAULT_AVATAR_FALLBACK = "/assets/default-avatar.svg";

// === Type-safe константы стилей для Feliona AI ===
const PADDING_CLASSES = {
  none: "",
  sm: "px-4 py-3 sm:px-6",
  md: "px-4 py-4 sm:px-6", 
  lg: "px-6 py-6 sm:px-8",
} as const;

const VARIANT_CLASSES = {
  default: "bg-[var(--bg-surface)] border border-[var(--border-primary)]",
  outlined: "bg-transparent border-2 border-[var(--border-secondary)]",
  elevated: "bg-[var(--bg-surface)] shadow-[var(--shadow-strong)] border border-[var(--border-primary)]",
  glass: "glass-morphism",
  character: "character-card",
  adult: "adult-card",
  pricing: "bg-[var(--bg-surface)] border-2 border-[var(--border-primary)]",
  relationship: "bg-[var(--bg-surface)] border border-[var(--border-secondary)] text-center",
} as const;

const BASE_CLASSES = "rounded-xl transition-all duration-[var(--duration-normal)] w-full max-w-full mx-auto";

const INTERACTIVE_CLASSES = [
  "cursor-pointer select-none",
  "hover:shadow-[var(--shadow-glow)] hover:-translate-y-2",
  "active:scale-[0.97]",
  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2",
  "focus-visible:ring-offset-[var(--background-color)]",
];

// === Type-safe типы ===
export type CardVariant = keyof typeof VARIANT_CLASSES;
export type CardPadding = keyof typeof PADDING_CLASSES;

// ✅ ИСПРАВЛЕНО: Правильные discriminated unions
interface BaseCardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  isAdult?: boolean;
  hoverEffect?: boolean;
  animationDelay?: number;
  children: ReactNode;
  "aria-label"?: string;
  "data-testid"?: string;
  className?: string;
}

// ✅ Div-based card props
export interface CardAsDivProps extends BaseCardProps, Omit<HTMLAttributes<HTMLDivElement>, keyof BaseCardProps> {
  as?: "div" | "section" | "article" | "aside" | "main";
  href?: never; // Explicitly exclude href for div cards
}

// ✅ Link-based card props  
export interface CardAsLinkProps extends BaseCardProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseCardProps> {
  href: string;
  as?: never; // Explicitly exclude as for link cards
}

// ✅ Discriminated union
export type CardProps = CardAsDivProps | CardAsLinkProps;

// ✅ Type guards для правильного inference
function isLinkCard(props: CardProps): props is CardAsLinkProps {
  return "href" in props && typeof props.href === "string";
}

// ✅ ИСПРАВЛЕНО: Separate components для proper type inference
const CardAsDiv = forwardRef<HTMLDivElement, CardAsDivProps>(
  (props, ref) => {
    const {
      variant = "default",
      padding = "md",
      interactive = false,
      isAdult = false,
      hoverEffect = false,
      animationDelay = 0,
      className,
      children,
      "data-testid": testId,
      as: Component = "div",
      ...rest
    } = props;

    const isClickable = Boolean(props.onClick || interactive);

    const computedClasses = useMemo(() => {
      const baseClasses = cn(
        BASE_CLASSES,
        (isClickable || interactive || hoverEffect) && INTERACTIVE_CLASSES
      );

      const specialClasses = cn(
        isAdult && "border-red-500/30 shadow-red-500/20",
        hoverEffect && "feature-card-hover",
        animationDelay > 0 && "fade-in-up",
      );

      return cn(
        baseClasses,
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        specialClasses,
        className
      );
    }, [variant, padding, isClickable, interactive, hoverEffect, isAdult, animationDelay, className]);

    const animationStyle = useMemo(() => 
      animationDelay > 0 
        ? { '--animation-delay': `${animationDelay * ANIMATION_DELAY_BASE_MS}ms` } as React.CSSProperties
        : undefined
    , [animationDelay]);

    const accessibilityProps = useMemo(() => {
      if (!isClickable) {
        return props["aria-label"] ? { "aria-label": props["aria-label"] } : {};
      }
      
      return {
        role: "button" as const,
        tabIndex: 0,
        "aria-label": props["aria-label"] || "Интерактивная карточка",
      };
    }, [isClickable, props]);

    return React.createElement(
      Component,
      {
        ref,
        className: computedClasses,
        style: animationStyle,
        ...accessibilityProps,
        "data-testid": testId,
        ...rest,
      },
      children
    );
  }
);

const CardAsLink = forwardRef<HTMLAnchorElement, CardAsLinkProps>(
  (props, ref) => {
    const {
      variant = "default",
      padding = "md",
      interactive = false,
      isAdult = false,
      hoverEffect = false,
      animationDelay = 0,
      className,
      children,
      "data-testid": testId,
      href,
      ...rest
    } = props;

    const computedClasses = useMemo(() => {
      const baseClasses = cn(
        BASE_CLASSES,
        INTERACTIVE_CLASSES // Links are always interactive
      );

      const specialClasses = cn(
        isAdult && "border-red-500/30 shadow-red-500/20",
        hoverEffect && "feature-card-hover",
        animationDelay > 0 && "fade-in-up",
      );

      return cn(
        baseClasses,
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        specialClasses,
        className
      );
    }, [variant, padding, hoverEffect, isAdult, animationDelay, className]);

    const animationStyle = useMemo(() => 
      animationDelay > 0 
        ? { '--animation-delay': `${animationDelay * ANIMATION_DELAY_BASE_MS}ms` } as React.CSSProperties
        : undefined
    , [animationDelay]);

    const accessibilityProps = {
      role: "link" as const,
      tabIndex: 0,
      "aria-label": props["aria-label"] || "Карточка-ссылка",
    };

    return (
      <a
        ref={ref}
        href={href}
        className={computedClasses}
        style={animationStyle}
        {...accessibilityProps}
        data-testid={testId}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

// ✅ Main Card component с правильным type inference
export const Card = forwardRef<
  HTMLDivElement | HTMLAnchorElement,
  CardProps
>((props, ref) => {
  if (isLinkCard(props)) {
    return <CardAsLink {...props} ref={ref as React.Ref<HTMLAnchorElement>} />;
  }
  
  return <CardAsDiv {...props} ref={ref as React.Ref<HTMLDivElement>} />;
});

Card.displayName = "Card";
CardAsDiv.displayName = "CardAsDiv";
CardAsLink.displayName = "CardAsLink";

// === Compound Components (unchanged) ===

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 px-4 sm:px-6 pt-0 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & { level?: HeadingLevel }
>(({ className, level = 3, ...props }, ref) => {
  const headingClasses = cn(
    "text-2xl font-semibold leading-tight tracking-tight",
    "text-[var(--text-primary)] truncate break-words px-0",
    {
      "text-4xl font-bold": level === 1,
      "text-3xl font-bold": level === 2,
      "text-2xl font-semibold": level === 3,
      "text-xl font-semibold": level === 4,
      "text-lg font-medium": level === 5,
      "text-base font-medium": level === 6,
    },
    className
  );

  // ✅ Type-safe heading creation
  const HeadingComponent = `h${level}` as const;

  return React.createElement(
    HeadingComponent,
    {
      ref: ref as React.Ref<HTMLHeadingElement>,
      className: headingClasses,
      ...props,
    }
  );
});
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-[var(--text-secondary)] whitespace-pre-line break-words px-0",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 w-full px-4 sm:px-6 pt-4 pb-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-2 w-full px-4 sm:px-6 pt-4 pb-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// === EIC-Specific Specialized Components ===

export interface CharacterCardProps extends Omit<CardAsDivProps, 'onClick'> {
  name: string;
  description: string;
  avatar: string;
  isAdult?: boolean;
  onClick?: () => void;
}

export const CharacterCard = forwardRef<HTMLDivElement, CharacterCardProps>(
  ({ name, description, avatar, isAdult = false, onClick, className, ...props }, ref) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      target.src = DEFAULT_AVATAR_FALLBACK;
    };

    return (
      <Card
        ref={ref}
        variant={isAdult ? "adult" : "character"}
        interactive={Boolean(onClick)}
        isAdult={isAdult}
        hoverEffect={true}
        onClick={onClick}
        className={cn("group", className)}
        aria-label={`Персонаж ${name}: ${description}`}
        {...props}
      >
        <CardContent className="text-center p-6">
          <div className="relative mb-4">
            <Image
              src={avatar}
              alt={name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full mx-auto object-cover breathing-animation"
              onError={handleImageError}
              priority={false}
              quality={85}
              sizes="80px"
            />
            {isAdult && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                18+
              </div>
            )}
          </div>
          <CardTitle level={4} className="mb-2">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    );
  }
);
CharacterCard.displayName = "CharacterCard";

export interface PricingCardProps extends Omit<CardAsDivProps, 'onClick'> {
  name: string;
  price: string;
  period?: string;
  description: string;
  relationshipLevels: string;
  features: readonly string[];
  isPopular?: boolean;
  buttonText: string;
  onSelect?: () => void;
}

export const PricingCard = forwardRef<HTMLDivElement, PricingCardProps>(
  ({ 
    name, 
    price, 
    period = "", 
    description, 
    relationshipLevels,
    features, 
    isPopular = false, 
    buttonText,
    onSelect,
    className,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      variant="pricing"
      className={cn(
        "relative",
        isPopular && "border-2 border-[var(--primary-color)] shadow-[var(--shadow-glow)]",
        className
      )}
      {...props}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
          <span className="bg-[var(--primary-color)] text-xs font-bold px-3 py-1 rounded-full text-white">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader>
        <CardTitle level={3}>{name}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {price}
          </span>
          {period && (
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {period}
            </span>
          )}
        </div>
        <CardDescription className="mb-2">{description}</CardDescription>
        
        <p className="text-xs text-[var(--text-secondary)]/70 italic">
          {relationshipLevels}
        </p>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-3 text-sm">
          {features.map((feature, index) => (
            <li key={`feature-${index}`} className="flex gap-3 items-center">
              <svg 
                className="text-green-500 flex-shrink-0" 
                fill="currentColor" 
                height="20" 
                viewBox="0 0 256 256" 
                width="20" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true"
              >
                <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
              <span className="text-[var(--text-secondary)]">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-6">
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "w-full flex items-center justify-center rounded-lg h-12 px-4",
            "text-sm font-bold transition-all",
            isPopular 
              ? "bg-[var(--primary-color)] text-white shadow-lg shadow-[var(--primary-color)]/20 hover:bg-opacity-90 hover:scale-105" 
              : "bg-[var(--secondary-color)] text-white hover:bg-opacity-80"
          )}
          aria-label={buttonText}
        >
          {buttonText}
        </button>
      </CardFooter>
    </Card>
  )
);
PricingCard.displayName = "PricingCard";

export default Card;