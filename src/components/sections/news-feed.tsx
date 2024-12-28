import { useState, useEffect, useRef, createContext, useContext } from 'react';
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

interface NewsContextType {
  news: NewsItem[];
  loading: boolean;
}

const NewsContext = createContext<NewsContextType | null>(null);

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchNews = async () => {
    if (isFetchingRef.current) {
      return;
    }

    console.log('Starting fetchNews...');
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const response = await fetch('/api/news', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      const processedItems = (data.items || []).map((item: NewsItem) => ({
        ...item,
        pubDate: new Date(item.pubDate).toISOString()
      }));
      
      setNews(processedItems);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setNews([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchNews();
    const intervalId = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading }}>
      {children}
    </NewsContext.Provider>
  );
}

export function NewsFeed() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const newsContext = useContext(NewsContext);

  if (!newsContext) {
    throw new Error('NewsFeed must be used within a NewsProvider');
  }

  const { news, loading } = newsContext;

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'dark';

  return (
    <Card className={cn(
      "rounded-none h-full w-full bg-background border-none shadow-none flex flex-col"
    )}>
      <CardHeader className="px-0 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b flex-none">
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
      <CardContent className="space-y-4 px-0 flex-grow overflow-y-auto">
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
                      {new Date(item.pubDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </a>
            ))}
            
            <div className="pt-2 border-t">
              <a
                href="https://www.bleepingcomputer.com/news/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  {
                    'text-[#FFE81F] group-hover:text-[#4FB8FF]': 
                      currentTheme === 'dark' || currentTheme === 'colourful',
                    'text-blue-600 group-hover:text-orange-600':
                      currentTheme === 'light'
                  }
                )}>
                  View More News
                </span>
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}