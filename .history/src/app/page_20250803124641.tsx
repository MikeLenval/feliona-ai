import { redirect } from 'next/navigation';

export default function RootPage() {
  // Простой редирект на английскую версию
  redirect('/en');
}
