import { ImageResponse } from 'next/og';
import React from 'react';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const W = parseInt(searchParams.get('width') || '1179', 10);
    const H = parseInt(searchParams.get('height') || '2556', 10);
    const dataString = searchParams.get('data') || '';

    // ─── Fonts ───────────────────────────────────────────────────────────────
    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    const mono300 = fs.readFileSync(path.join(fontsDir, 'GeistMono-Light.ttf'));
    const mono400 = fs.readFileSync(path.join(fontsDir, 'GeistMono-Regular.ttf'));
    const mono500 = fs.readFileSync(path.join(fontsDir, 'GeistMono-Medium.ttf'));

    // ─── Date logic ──────────────────────────────────────────────────────────
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const MS = 86_400_000;
    const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const total = 365 + (isLeap ? 1 : 0);
    const daysRem = Math.max(0, Math.round((end.getTime() - now.getTime()) / MS));
    const daysPast = total - daysRem;
    const entries = dataString.padEnd(total, '0').split('');
    const entryCount = entries.filter(x => x === '1').length;
    const pct = Math.round((entryCount / total) * 100);

    // ─── iOS Lockscreen safe zones (percentage-based) ─────────────────────
    const topSafe = Math.round(H * 0.18);   // clock + date + status bar
    const bottomSafe = Math.round(H * 0.10);   // flashlight / camera / home-bar
    const usableH = H - topSafe - bottomSafe;

    // ─── Proportional scale (base: 393pt logical = iPhone 14/15 Pro) ─────
    const scale = W / 393;
    const u = (v: number) => Math.round(v * scale);

    // ─── Card dimensions ──────────────────────────────────────────────────
    const cardW = Math.round(W * 0.86);
    const cardPad = u(14);
    const cardRadius = u(20);
    const borderPx = u(1);
    const gapCards = u(10);  // gap between the three cards

    // ─── Dot grid dimensions (14 cols, ~15% smaller than app) ────────────
    const COLS = 15;
    const dotGap = u(3);
    // dot size computed to exactly fill card width
    const dotSize = Math.floor((cardW - cardPad * 2 - dotGap * (COLS - 1)) / COLS);
    const innerFill = Math.round(dotSize * 0.24);
    const innerEmpty = Math.round(dotSize * 0.16);

    // ─── Build grid rows ──────────────────────────────────────────────────
    const gridRows: number[][] = [];
    for (let i = 0; i < total; i += COLS) {
      gridRows.push(Array.from({ length: Math.min(COLS, total - i) }, (_, j) => i + j));
    }
    const numRows = gridRows.length;

    // ─── Calculate explicit heights for each card ─────────────────────────
    // Stats card: single-line compact pill
    const statNumSize = u(13);
    const statsCardH = u(8) * 2 + statNumSize + 2; // tiny padV + single text line

    // Grid card: padding*2 + all dot rows + gaps between rows
    const gridInnerH = dotSize * numRows + dotGap * (numRows - 1);
    const gridCardH = cardPad * 2 + gridInnerH;

    // Bottom stats card: padding*2 + number row + label row
    const footNumH = u(18);
    const footLblH = u(14);
    const footInnerH = footNumH + u(3) + footLblH;
    const footCardH = u(14) * 2 + footInnerH;

    // Total content height
    const contentH = statsCardH + gapCards + gridCardH + gapCards + footCardH;

    // ─── Vertical offset: center content inside usable zone ──────────────
    // If content is taller than usable, start right at topSafe
    const rawOffset = topSafe + Math.round((usableH - contentH) / 2);
    const startY = Math.max(topSafe, rawOffset);

    // ─── Colors ───────────────────────────────────────────────────────────
    const C = {
      bg: '#090909',
      card: 'rgba(28,28,30,0.94)',
      border: 'rgba(255,255,255,0.10)',
      white: '#ffffff',
      dim: '#9a9a9a',
      muted: '#3a3a3c',
      future: 'rgba(58,58,60,0.4)',
      inner: 'rgba(255,255,255,0.16)',
      black: '#000000',
    } as const;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: W,
            height: H,
            backgroundColor: C.bg,
            fontFamily: '"Geist Mono"',
            position: 'relative',
          }}
        >
          {/* ── Explicit top spacer pushes content below the clock ── */}
          <div style={{ display: 'flex', width: W, height: startY, flexShrink: 0 }} />

          {/* ── Content column ── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: W,
            }}
          >

            {/* ── Stats pill (compact single line) ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: u(6),
                width: cardW,
                backgroundColor: C.card,
                border: `${borderPx}px solid ${C.border}`,
                borderRadius: u(12),
                paddingTop: u(8),
                paddingBottom: u(8),
                paddingLeft: cardPad,
                paddingRight: cardPad,
              }}
            >
              <span style={{ fontSize: u(13), color: C.white, fontWeight: 500, lineHeight: 1 }}>
                {daysRem}
              </span>
              <span style={{ fontSize: u(11), color: C.dim, fontWeight: 400, lineHeight: 1 }}>
                days left in {year}
              </span>
            </div>

            {/* ── Gap ── */}
            <div style={{ display: 'flex', height: gapCards }} />

            {/* ── Grid card ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: cardW,
                backgroundColor: C.card,
                border: `${borderPx}px solid ${C.border}`,
                borderRadius: cardRadius,
                padding: cardPad,
                gap: dotGap,
              }}
            >
              {gridRows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  style={{ display: 'flex', flexDirection: 'row', gap: dotGap }}
                >
                  {row.map((dayIdx) => {
                    const dayDate = new Date(start.getTime() + dayIdx * MS);
                    const isToday = dayDate.getTime() === now.getTime();
                    const isPast = dayDate < now;
                    const hasEntry = entries[dayIdx] === '1';

                    const outerBg = hasEntry
                      ? C.dim
                      : isPast || isToday
                        ? C.muted
                        : C.future;

                    const innerBg = hasEntry ? C.black : C.inner;
                    const innerSize = hasEntry ? innerFill : innerEmpty;

                    return (
                      <div
                        key={dayIdx}
                        style={{
                          width: dotSize,
                          height: dotSize,
                          borderRadius: '50%',
                          backgroundColor: outerBg,
                          border: isToday
                            ? `${Math.round(1.5 * scale)}px solid ${C.dim}`
                            : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: innerSize,
                            height: innerSize,
                            borderRadius: '50%',
                            backgroundColor: innerBg,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── Gap ── */}
            <div style={{ display: 'flex', height: gapCards }} />

          </div>
        </div>
      ),
      {
        width: W,
        height: H,
        fonts: [
          { name: 'Geist Mono', data: mono300, weight: 300, style: 'normal' },
          { name: 'Geist Mono', data: mono400, weight: 400, style: 'normal' },
          { name: 'Geist Mono', data: mono500, weight: 500, style: 'normal' },
        ],
      }
    );
  } catch (e) {
    return new Response(
      `Render Error: ${e instanceof Error ? e.message : String(e)}`,
      { status: 500 }
    );
  }
}
