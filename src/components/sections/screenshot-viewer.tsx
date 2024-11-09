"use client";

import { FC, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Screenshot {
  src: string;
  alt: string;
}

interface ScreenshotViewerProps {
  screenshots: Screenshot[];
  utility: string;
}

export const ScreenshotViewer: FC<ScreenshotViewerProps> = ({ screenshots, utility }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrevious = () => {
    setSelectedImageIndex(prev => 
      prev !== null ? (prev - 1 + screenshots.length) % screenshots.length : null
    );
    setIsLoading(true);
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => 
      prev !== null ? (prev + 1) % screenshots.length : null
    );
    setIsLoading(true);
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <div 
            key={index}
            className="group relative aspect-video cursor-pointer rounded-lg overflow-hidden 
                       hover:ring-2 hover:ring-primary/50 transition-all duration-300"
            onClick={() => {
              setSelectedImageIndex(index);
              setIsLoading(true);
            }}
          >
            <div className="relative w-full h-48">
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">{screenshot.alt}</p>
          </div>
        ))}
      </div>

      <Dialog 
        open={selectedImageIndex !== null} 
        onOpenChange={() => setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-7xl p-0 bg-background/95 backdrop-blur-sm">
          {selectedImageIndex !== null && (
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-full aspect-video">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                <Image
                  src={screenshots[selectedImageIndex].src}
                  alt={screenshots[selectedImageIndex].alt}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                  )}
                  priority
                  onLoadingComplete={() => setIsLoading(false)}
                />
              </div>

              {/* Navigation Buttons */}
              {screenshots.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-background/0">
                <p className="text-center text-sm">
                  {screenshots[selectedImageIndex].alt}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};