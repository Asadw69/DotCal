import { ImageResponse } from 'next/og';
import React from 'react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Params
    const width = parseInt(searchParams.get('width') || '1179', 10);
    const height = parseInt(searchParams.get('height') || '2556', 10);
    const top = parseInt(searchParams.get('top') || '240', 10);
    const bottom = parseInt(searchParams.get('bottom') || '200', 10);
    const dataString = searchParams.get('data') || '';
    const showPreview = searchParams.get('preview') === 'true';

    // Data generation (52 weeks * 7 days)
    const days = [];
    if (dataString && dataString.length >= 364) {
      for (let i = 0; i < 364; i++) {
        days.push(parseInt(dataString[i] || '0', 10));
      }
    } else {
      // Demo data
      for (let i = 0; i < 364; i++) {
        const r = Math.random();
        days.push(r > 0.8 ? 3 : r > 0.6 ? 2 : r > 0.4 ? 1 : 0);
      }
    }

    const weeks = [];
    for (let i = 0; i < 52; i++) {
      weeks.push(days.slice(i * 7, i * 7 + 7));
    }

    // Grid Calc
    const sidePadding = 40;
    const availableWidth = width - (sidePadding * 2);
    const dotSize = Math.floor(availableWidth / (52 + 51 * 0.4));
    const gap = Math.floor(dotSize * 0.4);

    const colors: Record<number, string> = {
      0: '#161b22', 
      1: '#39d353', 
      2: '#26a641', 
      3: '#006d32',
    };

    console.log(`Generating wallpaper: ${width}x${height}`);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: '#0d1117',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Debug Overlays */}
          {showPreview && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${top}px`, backgroundColor: 'rgba(255,0,0,0.1)', borderBottom: '1px dashed red', display: 'flex', color: 'red', padding: '10px' }}>Clock Zone</div>
          )}
          {showPreview && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${bottom}px`, backgroundColor: 'rgba(255,0,0,0.1)', borderTop: '1px dashed red', display: 'flex', color: 'red', padding: '10px', alignItems: 'flex-end' }}>Dock Zone</div>
          )}

          {/* Spacer Top */}
          <div style={{ height: `${top}px`, width: '100%' }} />

          {/* Grid Container */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: `0 ${sidePadding}px` }}>
            <div style={{ display: 'flex', gap: `${gap}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
                  {week.map((level, di) => (
                    <div
                      key={di}
                      style={{
                        width: `${dotSize}px`,
                        height: `${dotSize}px`,
                        backgroundColor: colors[level] || colors[0],
                        borderRadius: `${Math.max(2, Math.floor(dotSize * 0.22))}px`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Spacer Bottom */}
          <div style={{ height: `${bottom}px`, width: '100%' }} />
        </div>
      ),
      { width, height }
    );
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
