import { ImageResponse } from 'next/og';
import React from 'react';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const width = parseInt(searchParams.get('width') || '1179', 10);
    const height = parseInt(searchParams.get('height') || '2556', 10);
    const topSafe = parseInt(searchParams.get('top') || '240', 10);
    const bottomSafe = parseInt(searchParams.get('bottom') || '200', 10);
    const dataString = searchParams.get('data') || '';

    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    const geistMono300 = fs.readFileSync(path.join(fontsDir, 'GeistMono-Light.ttf'));
    const geistMono400 = fs.readFileSync(path.join(fontsDir, 'GeistMono-Regular.ttf'));
    const geistMono500 = fs.readFileSync(path.join(fontsDir, 'GeistMono-Medium.ttf'));

    const now = new Date();
    // Use fixed offset processing to prevent timezone matching errors
    now.setHours(0, 0, 0, 0);
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    
    // Exact safe day calculation
    const msPerDay = 86400000;
    const total = 365 + (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 1 : 0);
    const entriesArr = dataString.padEnd(total, '0').split('');

    const scale = width / 393;
    const px = (v: number) => v * scale;

    // Dark theme token mapping from globals.css
    const colors = {
      bg: 'linear-gradient(to bottom, #0d0d0d, #000000)',
      card: 'linear-gradient(to bottom, rgba(31, 31, 31, 0.8), rgba(26, 26, 26, 0.8))',
      border: 'rgba(255, 255, 255, 0.1)',
      primary: '#a0a0a0',
      primaryForeground: '#000000',
      muted: '#333333',
      mutedFuture: 'rgba(51, 51, 51, 0.5)',
      innerEmpty: 'rgba(250, 250, 250, 0.2)',
    };

    // Pre-calculate 14 columns grid rows
    const cols = 14;
    const rows = [];
    for (let i = 0; i < total; i += cols) {
      rows.push(Array.from({ length: Math.min(cols, total - i) }).map((_, j) => i + j));
    }

    // Exact dot calculations
    const gap = px(4);
    const padding = px(16);
    const cardContentWidth = (width * 0.85) - (padding * 2);
    const dotSize = Math.floor((cardContentWidth - (gap * (cols - 1))) / cols);
    const innerDotFilled = dotSize * 0.25;
    const innerDotEmpty = dotSize * 0.18;

    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width, height, background: colors.bg, alignItems: 'center', fontFamily: '"Geist Mono"' }}>
          {/* Top Safe Space */}
          <div style={{ height: `${topSafe}px`, width: '100%' }} />

          {/* Centered Content */}
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '85%' }}>
            
            {/* Grid Card Only */}
            <div style={{ display: 'flex', flexDirection: 'column', background: colors.card, border: `${px(1)}px solid ${colors.border}`, borderRadius: px(24), padding: padding, width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: gap }}>
                {rows.map((rowArr, rIdx) => (
                  <div key={rIdx} style={{ display: 'flex', flexDirection: 'row', gap: gap }}>
                    {rowArr.map((dayIdx) => {
                      const dayDate = new Date(start.getTime() + dayIdx * msPerDay);
                      const isToday = dayDate.getTime() === now.getTime();
                      const isPast = dayDate < now;
                      const hasEntry = entriesArr[dayIdx] === '1';

                      // Determine colors based on app logic
                      let outerBg = isPast || isToday ? colors.muted : colors.mutedFuture;
                      if (hasEntry) outerBg = colors.primary;
                      
                      const innerBg = hasEntry ? colors.primaryForeground : colors.innerEmpty;
                      const innerSize = hasEntry ? innerDotFilled : innerDotEmpty;

                      return (
                        <div key={dayIdx} style={{
                          width: `${dotSize}px`,
                          height: `${dotSize}px`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: outerBg,
                          border: isToday ? `${px(1.5)}px solid ${colors.primary}` : 'none',
                        }}>
                          <div style={{ 
                            width: `${innerSize}px`, 
                            height: `${innerSize}px`, 
                            borderRadius: '50%', 
                            backgroundColor: innerBg 
                          }} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Safe Space */}
          <div style={{ height: `${bottomSafe}px`, width: '100%' }} />
        </div>
      ),
      { 
        width, 
        height,
        fonts: [
          { name: 'Geist Mono', data: geistMono300, weight: 300, style: 'normal' },
          { name: 'Geist Mono', data: geistMono400, weight: 400, style: 'normal' },
          { name: 'Geist Mono', data: geistMono500, weight: 500, style: 'normal' },
        ],
      }
    );
  } catch (e) {
    return new Response(`Render Error: ${e instanceof Error ? e.message : String(e)}`, { status: 500 });
  }
}





