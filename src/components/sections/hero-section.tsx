"use client";

import { FC, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Shared gradient themes
const gradientThemes = {
  dark: 'from-purple-400 via-pink-500 to-red-500',
  light: 'from-blue-500 via-teal-500 to-emerald-500',
  colourful: 'from-[#FFE81F] via-[#4FB8FF] to-[#FFE81F]'
};

export const HeroSection: FC = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'dark';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-20 space-y-6 text-center"
    >
      <h1 className={cn(
        "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl",
        "bg-gradient-to-r bg-clip-text text-transparent",
        {
          'text-foreground': !mounted,
          [gradientThemes.dark]: currentTheme === 'dark' && mounted,
          [gradientThemes.light]: currentTheme === 'light' && mounted,
          [gradientThemes.colourful]: currentTheme === 'colourful' && mounted,
        }
      )}>
        Swatto&apos;s Useful Utilities
      </h1>
      
      <p className={cn(
        "mx-auto max-w-[700px] md:text-xl",
        currentTheme === 'colourful' ? 'text-[hsl(60,100%,70%)]' : 'text-muted-foreground'
      )}>
        Enhancing your productivity with custom-built tools
      </p>
    </motion.section>
  );
};

export default HeroSection;