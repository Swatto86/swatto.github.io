"use client";

import { FC, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl relative",
        "bg-gradient-to-r bg-clip-text text-transparent",
        {
          'from-[#4FB8FF] via-[#FFE81F] to-[#4FB8FF]': currentTheme === 'colourful',
          'from-white via-blue-200 to-white': currentTheme === 'dark',
          'from-blue-600 via-purple-600 to-orange-600': currentTheme === 'light'
        }
      )}>
        <span className="relative inline-block">
          Swatto&apos;s Useful Utilities
          <span 
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none",
              {
                'opacity-50': currentTheme === 'light',
                'opacity-30': currentTheme === 'dark',
                'opacity-40': currentTheme === 'colourful'
              }
            )}
            style={{ 
              maskImage: 'linear-gradient(to right, transparent, white, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, white, transparent)'
            }} 
          />
        </span>
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