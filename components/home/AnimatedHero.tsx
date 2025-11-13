'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CircleArrowDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

interface AnimatedHeroProps {
  locale: string;
  name: string;
  tagline: string;
  description: string;
  ctaPortfolio: string;
  ctaServices: string;
  badgeText: string;
}

export function AnimatedHero({
  locale,
  name,
  tagline,
  description,
  ctaPortfolio,
  ctaServices,
  badgeText,
}: AnimatedHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-6 overflow-hidden">
      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
          'inset-x-0 h-full skew-y-12'
        )}
      />

      {/* Content */}
      <div className="relative z-[1] text-center max-w-screen-md">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Badge className="rounded-full border-none">
            <Zap className="fill-current w-4 h-4 mr-1" />
            {badgeText}
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight"
        >
          {tagline}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-[17px] md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex items-center justify-center"
        >
          <Button asChild size="lg" className="rounded-full text-base">
            <Link href={`/${locale}/portfolio`}>
              {ctaPortfolio} <CircleArrowDown className="ml-2 !h-5.5 !w-5.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
