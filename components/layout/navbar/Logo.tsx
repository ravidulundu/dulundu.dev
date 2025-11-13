import Link from 'next/link';
import { useLocale } from 'next-intl';

export const Logo = () => {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className="flex items-center">
      <span className="text-xl font-bold text-primary">Dulundu.dev</span>
    </Link>
  );
};
