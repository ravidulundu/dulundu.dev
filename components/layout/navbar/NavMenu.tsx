import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export const NavMenu = ({ className, ...props }: NavigationMenuProps) => {
  const t = useTranslations('nav');
  const locale = useLocale();

  const navigation = [
    { name: t('services'), href: `/${locale}/services` },
    { name: t('portfolio'), href: `/${locale}/portfolio` },
    { name: t('blog'), href: `/${locale}/blog` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <NavigationMenu
      className={cn('data-[orientation=vertical]:items-start', className)}
      {...props}
    >
      <NavigationMenuList className="gap-1 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {navigation.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
