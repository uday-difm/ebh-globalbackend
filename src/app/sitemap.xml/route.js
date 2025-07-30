import { NextResponse } from 'next/server';

export async function GET() {
  // For example, redirect to sitemap_index.xml or generate sitemap.xml content here
  return new NextResponse(null, {
    status: 301,
    headers: {
      Location: '/sitemap_index.xml',
    },
  });
}