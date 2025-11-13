import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export const Logo = () => {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className="flex items-center">
      <Image src="/icon.svg" alt="Dulundu.dev" width={32} height={32} />
    </Link>
  );
};
