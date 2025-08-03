import { AgeVerificationWrapper } from './AgeVerificationWrapper';

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  return (
    <AgeVerificationWrapper locale={locale}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[var(--emotion-trust)] focus:text-white focus:py-2 focus:px-4 focus:rounded-md focus:no-underline"
      >
        Skip to main content
      </a>
      <div id="main-content">
        {children}
      </div>
    </AgeVerificationWrapper>
  );
}
