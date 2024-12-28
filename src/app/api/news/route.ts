import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

export const dynamic = 'force-dynamic';

const BLEEPING_COMPUTER_RSS = 'https://www.bleepingcomputer.com/feed/?posts_per_page=20';

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
}

export async function GET() {
  try {
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    console.log('Fetching RSS from:', BLEEPING_COMPUTER_RSS);

    const response = await fetch(BLEEPING_COMPUTER_RSS, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('Raw RSS feed length:', text.length);
    
    const xml = await parseStringPromise(text);
    console.log('Raw channel items:', xml.rss.channel[0].item.length);
    
    const items: RssItem[] = xml.rss.channel[0].item.map((item: any) => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: new Date(item.pubDate[0]).toISOString(),
    }));

    console.log('Parsed and mapped items:', items.length);

    const sortedItems = items.sort((a: RssItem, b: RssItem) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    console.log('Final sorted items:', sortedItems.length);

    return NextResponse.json({ items: sortedItems }, { headers });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.name + ": " + error.message);
    }
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}