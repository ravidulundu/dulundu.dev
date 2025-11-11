'use client';

import Navbar from './Navbar';
import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

/**
 * PageWrapper Component
 *
 * Wraps page content with consistent Navbar and Footer navigation.
 * Used across all pages to ensure uniform navigation experience.
 *
 * @param children - Page content to be wrapped
 * @param showFooter - Optional flag to hide footer (default: true)
 *
 * @example
 * ```tsx
 * export default function SomePage() {
 *   return (
 *     <PageWrapper>
 *       <div className="container">
 *         // Your page content
 *       </div>
 *     </PageWrapper>
 *   );
 * }
 * ```
 */
export default function PageWrapper({
  children,
  showFooter = true
}: PageWrapperProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
