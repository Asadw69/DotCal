import { ImageResponse } from 'next/og';
import WallpaperGrid from '@/components/WallpaperGrid';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Default to iPhone 14/15 Pro Max resolution roughly
    const width = parseInt(searchParams.get('width') || '1179', 10);
    const height = parseInt(searchParams.get('height') || '2556', 10);
    
    // Top and Bottom Safe Areas
    const topSafeArea = parseInt(searchParams.get('top') || searchParams.get('topSafeArea') || '240', 10);
    const bottomSafeArea = parseInt(searchParams.get('bottom') || searchParams.get('bottomSafeArea') || '200', 10);
    
    // Allow overriding the simulated calendar data
    const dataString = searchParams.get('data') || '';

    // Generate 52 weeks * 7 days (364 days) of contribution data
    const days = [];
    if (dataString && dataString.length >= 364) {
      for (let i = 0; i < 364; i++) {
        days.push(parseInt(dataString[i] || '0', 10));
      }
    } else {
      // Simulated natural pattern if no data provided
      for (let i = 0; i < 364; i++) {
        const rand = Math.random();
        if (rand > 0.85) days.push(3); // high
        else if (rand > 0.65) days.push(2); // medium
        else if (rand > 0.45) days.push(1); // low
        else days.push(0); // empty
      }
    }

    return new ImageResponse(
      (
        <WallpaperGrid 
          width={width}
          height={height}
          topSafeArea={topSafeArea}
          bottomSafeArea={bottomSafeArea}
          days={days}
        />
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    console.error('Error generating wallpaper:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
