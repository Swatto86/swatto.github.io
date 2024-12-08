"use client";

import { FC } from 'react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const HeroSection: FC = () => {
  const { theme } = useTheme();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-20 space-y-6 text-center"
    >
      <h1 className={cn(
        "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl",
        theme === 'colourful' 
          ? 'text-[hsl(60,100%,70%)]' 
          : theme === 'dark'
            ? 'bg-gradient-to-r from-white via-blue-200 to-white text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]'
      )}>
        <span className="relative inline-block">
          Swatto&apos;s Useful Utilities
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                style={{ maskImage: 'linear-gradient(to right, transparent, white, transparent)' }} />
        </span>
      </h1>
      
      <p className={cn(
        "mx-auto max-w-[700px] md:text-xl",
        theme === 'colourful' ? 'text-[hsl(60,100%,70%)]' : 'text-muted-foreground'
      )}>
        Enhancing your productivity with custom-built tools
      </p>
    </motion.section>
  );
};

export default HeroSection;