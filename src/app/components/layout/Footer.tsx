/**
 * ============================================
 * Feliona AI - Footer Component - MINIMAL FIX
 * 🔗 Подвал с ссылками, copyright и social media
 * 
 * FIXED ISSUES (2-3 минуты):
 * ✅ P0: Removed duplicate analytics (use shared from Header)
 * ✅ P1: Cached currentYear calculation
 * 
 * SIZE: -12 lines (95% of original - MINIMAL CHANGE)
 * ============================================
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';

// Типы из EIC системы
interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

interface FooterSection {
  title: string;
  links: readonly FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

interface FooterProps {
  className?: string;
  // FIX 1: Accept analytics function from parent instead of duplicating
  onFooterAction?: (eventName: string, label: string) => void;
}

// Конфигурация ссылок
const FOOTER_SECTIONS: readonly FooterSection[] = [
  {
    title: 'Platform',
    links: [
      { name: 'Companions', href: '/companions', ariaLabel: 'Browse AI companions' },
      { name: 'Relationships', href: '/#relationships', ariaLabel: 'Learn about relationship system' },
      { name: 'Pricing', href: '/#pricing', ariaLabel: 'View pricing plans' },
      { name: 'Features', href: '/features', ariaLabel: 'Platform features' },
    ],
  },
  {
    title: 'Safety & Privacy',
    links: [
      { name: 'Privacy Policy', href: '/privacy', ariaLabel: 'Read privacy policy' },
      { name: 'Terms of Service', href: '/terms', ariaLabel: 'Read terms of service' },
      { name: 'Content Policy', href: '/content-policy', ariaLabel: 'Content moderation policy' },
      { name: 'Age Verification', href: '/age-verification', ariaLabel: 'Age verification information' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help', ariaLabel: 'Get help and support' },
      { name: 'Contact Us', href: '/contact', ariaLabel: 'Contact support team' },
      { name: 'Bug Reports', href: '/bug-report', ariaLabel: 'Report a bug' },
      { name: 'Feature Requests', href: '/feature-request', ariaLabel: 'Request new features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about', ariaLabel: 'Learn about Feliona AI' },
      { name: 'Blog', href: '/blog', ariaLabel: 'Read our blog' },
      { name: 'Careers', href: '/careers', ariaLabel: 'Join our team' },
      { name: 'Press Kit', href: '/press', ariaLabel: 'Media and press resources' },
    ],
  },
] as const;

// Social media ссылки
const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/feliona_ai',
    ariaLabel: 'Follow us on Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/feliona',
    ariaLabel: 'Join our Discord community',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/feliona-ai',
    ariaLabel: 'View our open source projects',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Reddit',
    href: 'https://reddit.com/r/feliona',
    ariaLabel: 'Join our Reddit community',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
] as const;

/**
 * Footer компонент для Feliona AI
 * Responsive подвал с ссылками, social media и copyright
 */
export function Footer({ className = "", onFooterAction }: FooterProps) {
  // FIX 2: Cache current year calculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Обработчик кликов по ссылкам
  const handleLinkClick = useCallback((linkName: string, external = false) => {
    onFooterAction?.(external ? 'external_link_click' : 'internal_link_click', linkName.toLowerCase());
  }, [onFooterAction]);

  // Обработчик кликов по social media
  const handleSocialClick = useCallback((socialName: string) => {
    onFooterAction?.('social_link_click', socialName.toLowerCase());
  }, [onFooterAction]);

  return (
    <footer 
      className={`py-12 bg-transparent ${className}`}
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg 
                className="h-8 w-8 text-[var(--primary-color)]" 
                fill="none" 
                viewBox="0 0 48 48" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true"
              >
                <path 
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" 
                  fill="currentColor"
                />
              </svg>
              <h2 
                id="footer-heading"
                className="text-xl font-bold tracking-tighter text-[var(--text-primary)]"
              >
                Feliona AI
              </h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Emotionally intelligent AI companions for meaningful connections. 
              Experience relationships without filters or judgment.
            </p>
            
            {/* Age Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-600/20 border border-red-500/30 rounded-md px-2 py-1">
                <span className="text-xs font-bold text-red-400">18+</span>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">
                Adult content platform
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                  onClick={() => handleSocialClick(social.name)}
                  aria-label={social.ariaLabel}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        onClick={() => handleLinkClick(link.name, true)}
                        aria-label={link.ariaLabel}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        onClick={() => handleLinkClick(link.name)}
                        aria-label={link.ariaLabel}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border-primary)] pt-8">
          
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-[var(--text-secondary)]">
                © {currentYear} Feliona AI. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => handleLinkClick('Privacy Policy')}
                aria-label="Политика конфиденциальности"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => handleLinkClick('Terms of Service')}
                aria-label="Условия использования"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => handleLinkClick('Cookie Policy')}
                aria-label="Политика использования cookie"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Additional Disclaimers */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed max-w-4xl mx-auto">
              Feliona AI is an adult-oriented platform featuring AI-generated content and conversations. 
              All AI companions are fictional characters. Users must be 18+ years old. 
              This platform is not intended to replace real human relationships or professional services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;