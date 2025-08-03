/**
 * ============================================
 * Public Landing Page - EIC v2025
 * 🎯 Production-ready публичная страница
 * ============================================
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AgeVerificationWrapper } from './AgeVerificationWrapper';
import { Hero } from '@/app/components/features/Hero';

interface PublicPageProps {
  params: {
    locale: string;
  };
}

/**
 * Генерация метаданных для публичной страницы
 */
export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { locale } = params;
  
  // Валидация локали
  const validLocales = ['en', 'ru', 'es', 'fr', 'de'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  const titles = {
    en: 'Feliona AI - Emotionally Intelligent Companions',
    ru: 'Feliona AI - Эмоционально интеллектуальные компаньоны',
    es: 'Feliona AI - Compañeros Emocionalmente Inteligentes',
    fr: 'Feliona AI - Compagnons Émotionnellement Intelligents',
    de: 'Feliona AI - Emotional Intelligente Begleiter'
  };

  const descriptions = {
    en: 'Next-generation AI companions with deep emotional intelligence. Experience meaningful relationships with AI that understands and responds to your emotions.',
    ru: 'AI-компаньоны нового поколения с глубоким эмоциональным интеллектом. Испытайте значимые отношения с ИИ, который понимает и реагирует на ваши эмоции.',
    es: 'Compañeros de IA de nueva generación con inteligencia emocional profunda. Experimenta relaciones significativas con IA que entiende y responde a tus emociones.',
    fr: 'Compagnons IA de nouvelle génération avec une intelligence émotionnelle profonde. Vivez des relations significatives avec une IA qui comprend et répond à vos émotions.',
    de: 'KI-Begleiter der nächsten Generation mit tiefer emotionaler Intelligenz. Erleben Sie bedeutungsvolle Beziehungen mit KI, die Ihre Emotionen versteht und darauf reagiert.'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      locale: locale,
      siteName: 'Feliona AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ru': '/ru',
        'es': '/es',
        'fr': '/fr',
        'de': '/de',
      },
    },
  };
}

/**
 * Статическая генерация путей для всех поддерживаемых локалей
 */
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' },
  ];
}

/**
 * Публичная главная страница
 * Включает возрастную верификацию и основной контент
 */
export default async function PublicPage({ params }: PublicPageProps) {
  const { locale } = params;
  
  // Валидация локали
  const validLocales = ['en', 'ru', 'es', 'fr', 'de'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  return (
    <AgeVerificationWrapper locale={locale}>
      <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-brand-950">
        {/* Hero Section */}
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse text-brand-600 dark:text-brand-400">
              Loading...
            </div>
          </div>
        }>
          <Hero />
        </Suspense>
      </main>
    </AgeVerificationWrapper>
  );
}
