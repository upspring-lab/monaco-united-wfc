import type { ReactNode } from 'react';

// Le <html> est rendu par app/[locale]/layout.tsx pour porter l'attribut lang.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
