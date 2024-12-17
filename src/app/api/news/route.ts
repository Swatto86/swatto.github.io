import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();
const BLEEPING_COMPUTER_RSS = 'https://www.bleepingcomputer.com/feed/';

export async function GET() {
  try {
    const feed = await parser.parseURL(BLEEPING_COMPUTER_RSS);
    
    return NextResponse.json({
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
      }))
    });
  } catch (error) {
    console.error('Failed to fetch RSS feed:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 