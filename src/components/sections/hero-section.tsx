"use client";

import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

interface Update {
  text: string;
  date: string;
}

const updates: Update[] = [
  { text: "New BitBurn release", date: "2023-12" },
  { text: "EventSleuth improvements", date: "2023-11" },
  { text: "PSTInsight updates", date: "2023-10" },
];

export const HeroSection: FC = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [currentUpdate, setCurrentUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % updates.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section 
      style={{ y, opacity }}
      className="relative pt-20 space-y-6 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={cn(
          "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl",
          theme === 'colourful' ? 'text-[hsl(60,100%,70%)]' : 'text-foreground'
        )}>
          Swatto&apos;s Useful Utilities
        </h1>
        
        <p className={cn(
          "mx-auto max-w-[700px] md:text-xl mt-4",
          theme === 'colourful' ? 'text-[hsl(60,100%,70%)]' : 'text-muted-foreground'
        )}>
          Enhancing your productivity with custom-built tools
        </p>

        <div className="mt-8 overflow-hidden h-8">
          <motion.div
            key={currentUpdate}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "text-sm",
              theme === 'colourful' ? 'text-[hsl(60,100%,80%)]' : 'text-muted-foreground'
            )}
          >
            Latest: {updates[currentUpdate].text} ({updates[currentUpdate].date})
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;