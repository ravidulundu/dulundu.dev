'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : false;

  const handleToggle = () => {
    if (!mounted) return;
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="relative h-9 w-9 rounded-full border-border text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      <Sun className={`h-4 w-4 transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`} />
      <Moon className={`absolute h-4 w-4 transition-opacity ${isDark ? 'opacity-100' : 'opacity-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
