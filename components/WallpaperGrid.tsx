import React from 'react';

export default function WallpaperGrid({ width, height, topSafeArea, bottomSafeArea, days }: any) {
  // We need to divide days into columns of 7 days
  const weeks = [];
  const colCount = 52;
  const daysInCol = 7;
  
  for (let i = 0; i < colCount; i++) {
    weeks.push(days.slice(i * daysInCol, i * daysInCol + daysInCol));
  }

  // Calculate size to fit the width comfortably
  // with 40px padding left/right
  const sidePadding = 40;
  const availableWidth = width - (sidePadding * 2);
  
  // We want: 52 columns * dotSize + 51 columns * gap = availableWidth
  // Let gap be a factor of dotSize (e.g., 0.4)
  // 52 * dotSize + 51 * (0.4 * dotSize) = 72.4 * dotSize = availableWidth
  const dotSize = Math.max(8, Math.floor(availableWidth / 72.4));
  const gap = Math.max(2, Math.floor(dotSize * 0.4));

  // The prompt requested this intensity system:
  // 0 = grey
  // low = light green
  // medium = green
  // high = dark green
  const colors = {
    0: '#161b22', // grey (GitHub style empty dark)
    1: '#39d353', // light green (low)
    2: '#26a641', // green (medium)
    3: '#006d32', // dark green (high)
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#0d1117', // GitHub dark layout
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Top Safe Area - Empty space for Clock & Date */}
      <div style={{ display: 'flex', flexBasis: `${topSafeArea}px`, flexShrink: 0, width: '100%' }} />

      {/* Center Main Calendar Grid */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingLeft: `${sidePadding}px`,
          paddingRight: `${sidePadding}px`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: `${gap}px`,
          }}
        >
          {weeks.map((week, weekIdx) => (
            <div
              key={weekIdx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${gap}px`,
              }}
            >
              {week.map((level: number, dayIdx: number) => (
                <div
                  key={dayIdx}
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: colors[level as keyof typeof colors] || colors[0],
                    borderRadius: `${Math.max(2, Math.floor(dotSize * 0.2))}px`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Safe Area - Empty space for App Dock */}
      <div style={{ display: 'flex', flexBasis: `${bottomSafeArea}px`, flexShrink: 0, width: '100%' }} />
    </div>
  );
}
