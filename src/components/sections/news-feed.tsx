import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Card className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
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
            {news.slice(0, 5).map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex items-start space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.pubDate).toLocaleDateString()}</p>
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