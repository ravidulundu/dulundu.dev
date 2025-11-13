'use client';

import { motion, Variants } from 'framer-motion';
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  gradient?: boolean;
  delay?: number;
}

export function AnimatedText({ text, className, gradient = false, delay = 0 }: AnimatedTextProps) {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className={cn(
            'inline-block mr-2',
            gradient &&
              'bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient'
          )}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface TypewriterProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
}

export function Typewriter({
  texts,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 2000,
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = texts[currentTextIndex];

        if (!isDeleting) {
          // Typing
          if (currentText.length < fullText.length) {
            setCurrentText(fullText.substring(0, currentText.length + 1));
          } else {
            // Wait before deleting
            setTimeout(() => setIsDeleting(true), delayBetweenTexts);
          }
        } else {
          // Deleting
          if (currentText.length > 0) {
            setCurrentText(currentText.substring(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, typingSpeed, deletingSpeed, delayBetweenTexts]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block w-0.5 h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className, animate = true }: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-[length:200%_auto] bg-clip-text text-transparent',
        animate && 'animate-gradient',
        className
      )}
    >
      {children}
    </span>
  );
}
