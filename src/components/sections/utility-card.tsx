import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { SHA256Copy } from "@/components/sha256-copy";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface UtilityCardProps {
  title: string;
  version: string;
  description: string;
  gradient: string;
  downloadCount: number;
  sha256: string;
  downloadLink: string;
  onDownload: () => Promise<void>;
  children: React.ReactNode;
}

export const UtilityCard: FC<UtilityCardProps> = ({
  title,
  version,
  description,
  gradient,
  downloadCount,
  sha256,
  downloadLink,
  onDownload,
  children
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // Increment download counter
      await onDownload();

      // Show download started toast
      toast({
        title: "Download Started",
        description: `${title} download has started. Thank you for using our tools!`,
        duration: 5000,
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = downloadLink.split('/').pop() || '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Started",
        description: "Download should start shortly.",
        duration: 5000,
      });
    } finally {
      // Reset downloading state after a short delay
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }
  };

  return (
    <Card className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className={cn(
            "bg-gradient-to-r bg-clip-text text-transparent",
            "[data-theme='dark']:from-red-500/80 [data-theme='dark']:to-red-700/80",
            gradient
          )}>
            {title}
          </span>
          <Badge className={cn(
            "bg-gradient-to-r text-white",
            "[data-theme='dark']:from-red-800/90 [data-theme='dark']:to-red-950/90",
            gradient
          )}>
            v{version}
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Button 
            asChild
            className={cn(
              "bg-gradient-to-r hover:opacity-90 transition-all duration-300 transform hover:scale-105 h-11 px-8 rounded-md w-full sm:w-auto",
              "[data-theme='dark']:from-red-800 [data-theme='dark']:to-red-950",
              gradient
            )}
            disabled={isDownloading}
          >
            <Link 
              href={downloadLink}
              onClick={handleDownload}
              prefetch={false}
            >
              <Download className={`mr-2 h-4 w-4 ${!isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? 'Starting Download...' : `Download ${title}`}
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Downloads: {downloadCount.toLocaleString()}
          </p>
          <SHA256Copy value={sha256} />
        </div>
        {children}
      </CardContent>
    </Card>
  );
};