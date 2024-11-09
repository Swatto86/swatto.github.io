"use client";

import { FC } from 'react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

export const HeroSection: FC = () => {
  const { theme } = useTheme();

  return (
    <section className="pt-20 space-y-6 text-center animate-fade-up">
      <h1 className={cn(
        "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl",
        theme === 'colourful' ? 'text-[hsl(60,100%,70%)]' : 'text-foreground'
      )}>
        Swatto&apos;s Useful Utilities
      </h1>
      <p className={cn(
        "mx-auto max-w-[700px] md:text-xl",
        theme === 'colourful' ? 'text-[hsl(60,100%,70%)]' : 'text-muted-foreground'
      )}>
        Enhancing your productivity with custom-built tools
      </p>
    </section>
  );
};

export default HeroSection;