import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export const Logo = () => {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className="flex items-center gap-2">
      <Image src="/icon.svg" alt="Dulundu.dev" width={32} height={32} className="rounded-md" />
      <span className="text-xl font-bold text-primary hidden sm:inline">Dulundu.dev</span>
    </Link>
  );
};
