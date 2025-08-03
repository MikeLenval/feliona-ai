# Google Analytics 4 Setup Guide

## Интеграция GA4 в Feliona AI

### Пример использования в layout.tsx

```tsx
import GoogleAnalytics from '@/components/GoogleAnalytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <GoogleAnalytics
          measurementId="G-XXXXXXXXXX"
          debugMode={process.env.NODE_ENV === 'development'}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Настройка переменных окружения

В файле `.env.local` добавьте:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Затем используйте в layout.tsx:

```tsx
<GoogleAnalytics
  measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!}
  debugMode={process.env.NODE_ENV === 'development'}
/>
```

### Использование в компонентах

Импортируйте функции аналитики:

```tsx
import { trackNavigation, trackCompanions, trackChat } from '@/lib/analytics';

// Пример в компоненте:
const handleButtonClick = () => {
  trackNavigation.ctaClick();
  // Ваша логика...
};

const handleCompanionSelect = (companionId: string) => {
  trackCompanions.viewCompanion(companionId);
  // Ваша логика...
};
```

### Автоматическое отслеживание страниц

Используйте HOC для автоматического трекинга:

```tsx
import { withPageTracking } from '@/components/GoogleAnalytics';

const MyPage = () => {
  return <div>Содержимое страницы</div>;
};

export default withPageTracking(MyPage, 'Название страницы');
```
