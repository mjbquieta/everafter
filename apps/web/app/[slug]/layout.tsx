import type { ReactNode } from 'react';

export default function PublicWeddingLayout({
  children,
}: {
  children: ReactNode;
}) {
  // No wrapper needed - children (PublicWeddingClient) handles its own styling
  return <>{children}</>;
}
