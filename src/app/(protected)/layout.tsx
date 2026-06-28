import { Navigation } from '@/components/layout/Navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
}
