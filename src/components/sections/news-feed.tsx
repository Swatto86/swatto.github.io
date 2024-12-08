import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// Shared gradient themes
const gradientThemes = {
  dark: 'from-purple-400 via-pink-500 to-red-500',
  light: 'from-blue-500 via-teal-500 to-emerald-500',
  colourful: 'from-[#FFE81F] via-[#4FB8FF] to-[#FFE81F]'
};

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data.items || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'dark';

  return (
    <Card className={cn(
      "rounded-none h-full w-full bg-background"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <span className={cn(
            "text-center font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent",
            {
              'text-foreground': !mounted,
              [gradientThemes.dark]: currentTheme === 'dark' && mounted,
              [gradientThemes.light]: currentTheme === 'light' && mounted,
              [gradientThemes.colourful]: currentTheme === 'colourful' && mounted,
            }
          )}>
            Latest Security News
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading news...</p>
        ) : news.length === 0 ? (
          <p className="text-center text-muted-foreground">No news available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {news.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                  <div>
                    <p className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        'text-[#FFE81F] group-hover:text-[#4FB8FF]': 
                          currentTheme === 'dark' || currentTheme === 'colourful',
                        'text-blue-600 group-hover:text-orange-600':
                          currentTheme === 'light'
                      }
                    )}>
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.pubDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 