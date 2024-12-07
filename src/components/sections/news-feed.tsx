import { useState, useEffect } from 'react';
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
    <div className="bg-[#1a0f2e] h-full min-h-screen p-4">
      <h2 className="text-[#4FB8FF] font-semibold mb-6">Latest Security News</h2>
      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading news...</p>
        ) : news.length === 0 ? (
          <p className="text-muted-foreground">No news available.</p>
        ) : (
          <div className="space-y-2">
            {news.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex items-start space-x-2 hover:bg-white/5 rounded p-2 transition-colors">
                  <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0 text-[#FFE81F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <p className="text-sm text-[#FFE81F] group-hover:text-[#4FB8FF] transition-colors line-clamp-2">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(item.pubDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 