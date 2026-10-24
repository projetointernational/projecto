'use client';

import React, { useState } from 'react';

export interface SectorItem {
  id: string;
  label: string;
  lines: string[];
  icon: string;
  bgColor: string;
  textColor: string;
  iconStroke: string;
}

export const CANONICAL_DISCIPLINES: SectorItem[] = [
  {
    id: 'architects',
    label: 'ARCHITECTS',
    lines: ['ARCHITECTS'],
    icon: 'architects',
    bgColor: '#E8E2D5',
    textColor: '#1E221F',
    iconStroke: '#1E221F',
  },
  {
    id: 'material-suppliers',
    label: 'MATERIAL SUPPLIERS & VENDORS',
    lines: ['MATERIAL', 'SUPPLIERS &', 'VENDORS'],
    icon: 'suppliers',
    bgColor: '#5A663E',
    textColor: '#FFFFFF',
    iconStroke: '#FFFFFF',
  },
  {
    id: 'structural-engineers',
    label: 'STRUCTURAL / CIVIL ENGINEERS',
    lines: ['STRUCTURAL /', 'CIVIL ENGINEERS'],
    icon: 'structural',
    bgColor: '#DCD7CA',
    textColor: '#1E221F',
    iconStroke: '#1E221F',
  },
  {
    id: 'interior-designers',
    label: 'INTERIOR DESIGNERS',
    lines: ['INTERIOR', 'DESIGNERS'],
    icon: 'interior',
    bgColor: '#222724',
    textColor: '#FFFFFF',
    iconStroke: '#FFFFFF',
  },
  {
    id: 'mep-consultants',
    label: 'MEP CONSULTANTS',
    lines: ['MEP', 'CONSULTANTS'],
    icon: 'mep',
    bgColor: '#E8E2D5',
    textColor: '#1E221F',
    iconStroke: '#1E221F',
  },
  {
    id: 'vaasthu-consultants',
    label: 'VAASTHU CONSULTANTS WHERE REQUIRED',
    lines: ['VAASTHU', 'CONSULTANTS', 'WHERE REQUIRED'],
    icon: 'vaasthu',
    bgColor: '#5A663E',
    textColor: '#FFFFFF',
    iconStroke: '#FFFFFF',
  },
  {
    id: 'main-contractors',
    label: 'MAIN & SPECIALIST CONTRACTORS',
    lines: ['MAIN & SPECIALIST', 'CONTRACTORS'],
    icon: 'contractors',
    bgColor: '#DCD7CA',
    textColor: '#1E221F',
    iconStroke: '#1E221F',
  },
  {
    id: 'civil-construction',
    label: 'CIVIL CONSTRUCTION TEAMS',
    lines: ['CIVIL', 'CONSTRUCTION', 'TEAMS'],
    icon: 'construction',
    bgColor: '#222724',
    textColor: '#FFFFFF',
    iconStroke: '#FFFFFF',
  },
  {
    id: 'interior-finishing',
    label: 'INTERIOR & FINISHING TEAMS',
    lines: ['INTERIOR &', 'FINISHING TEAMS'],
    icon: 'finishing',
    bgColor: '#E8E2D5',
    textColor: '#1E221F',
    iconStroke: '#1E221F',
  },
  {
    id: 'electrical-plumbing',
    label: 'ELECTRICAL & PLUMBING TEAMS',
    lines: ['ELECTRICAL &', 'PLUMBING TEAMS'],
    icon: 'electrical-plumbing',
    bgColor: '#5A663E',
    textColor: '#FFFFFF',
    iconStroke: '#FFFFFF',
  },
  {
    id: 'landscaping',
    label: 'LANDSCAPING TEAMS',
    lines: ['LANDSCAPING', 'TEAMS'],
    icon: 'landscaping',
    bgColor: '#DCD7CA',
    textColor: '#1E221F',
    iconStroke: '#1E221F',
  },
  {
    id: 'specialist-resources',
    label: 'SPECIALIST PROJECT RESOURCES',
    lines: ['SPECIALIST PROJECT', 'RESOURCES'],
    icon: 'resources',
    bgColor: '#222724',
    textColor: '#FFFFFF',
    iconStroke: '#FFFFFF',
  },
];

interface CoordinationWheelProps {
  customHighlights?: string[] | null;
  activeDiscipline?: string | null;
  onDisciplineHover?: (name: string | null) => void;
}

export const CoordinationWheel: React.FC<CoordinationWheelProps> = ({
  customHighlights,
  onDisciplineHover,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Keyword lookup map so highlights from CMS in ANY order map to the correct sector
  const keywordMap: Record<string, RegExp> = {
    architects: /ARCHITECT/i,
    'material-suppliers': /MATERIAL|SUPPLIER|VENDOR/i,
    'structural-engineers': /STRUCTURAL|CIVIL ENGINEER/i,
    'interior-designers': /INTERIOR DESIGN/i,
    'mep-consultants': /MEP/i,
    'vaasthu-consultants': /VAASTHU|VASTU/i,
    'main-contractors': /MAIN|SPECIALIST CONTRACTOR/i,
    'civil-construction': /CIVIL CONSTRUCTION/i,
    'interior-finishing': /FINISHING/i,
    'electrical-plumbing': /ELECTRICAL|PLUMBING/i,
    landscaping: /LANDSCAPE|LANDSCAPING/i,
    'specialist-resources': /SPECIALIST PROJECT|PROJECT RESOURCE|SPECIALIST RESOURCE/i,
  };

  // If custom highlights are supplied, match them to canonical sectors by keywords
  const disciplines = CANONICAL_DISCIPLINES.map((canonical) => {
    if (customHighlights && customHighlights.length > 0) {
      const regex = keywordMap[canonical.id];
      const matchedHighlight = customHighlights.find((h) => regex && regex.test(h));

      if (matchedHighlight) {
        const customLabel = matchedHighlight.trim().toUpperCase();

        if (customLabel === canonical.label.toUpperCase()) {
          return canonical;
        }

        if (canonical.id === 'main-contractors' || customLabel.includes('CONTRACTOR')) {
          return {
            ...canonical,
            label: customLabel,
            lines: ['MAIN & SPECIALIST', 'CONTRACTORS'],
          };
        }

        const words = customLabel.split(' ');
        let lines: string[] = [];
        if (words.length <= 2) {
          lines = [customLabel];
        } else if (words.length === 3) {
          lines = [words[0], words[1], words[2]];
        } else {
          const mid = Math.ceil(words.length / 2);
          lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
        }

        return {
          ...canonical,
          label: customLabel,
          lines,
        };
      }
    }
    return canonical;
  });

  const cx = 450;
  const cy = 450;
  const rInner = 180;
  const rOuter = 422;

  // Arc path generator
  const getSectorPath = (index: number) => {
    const startDeg = -105 + index * 30;
    const endDeg = -75 + index * 30;

    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;

    const x1 = cx + rOuter * Math.cos(startRad);
    const y1 = cy + rOuter * Math.sin(startRad);
    const x2 = cx + rOuter * Math.cos(endRad);
    const y2 = cy + rOuter * Math.sin(endRad);
    const x3 = cx + rInner * Math.cos(endRad);
    const y3 = cy + rInner * Math.sin(endRad);
    const x4 = cx + rInner * Math.cos(startRad);
    const y4 = cy + rInner * Math.sin(startRad);

    return `M ${x4} ${y4} L ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;
  };

  // Render vector icon for discipline
  const renderIcon = (type: string, stroke: string) => {
    switch (type) {
      case 'architects':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M-13 -13 H6 L13 -6 V13 H-13 Z" />
            <path d="M6 -13 V-6 H13" />
            <path d="M-7 -4 H3 V6 H-7 Z" strokeDasharray="2 2" strokeWidth="1.2" />
            <path d="M-7 1 H3" strokeWidth="1.2" />
            <path d="M-2 -4 V6" strokeWidth="1.2" />
            <path d="M6 -16 L17 -5 M8 -18 L18 -8" strokeWidth="1.5" />
          </g>
        );

      case 'suppliers':
        return (
          <g stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0 -15 L10 -9.5 L0 -4 L-10 -9.5 Z" />
            <path d="M-10 -9.5 L0 -4 V1 L-10 -4.5 Z" />
            <path d="M0 -4 L10 -9.5 V-4 L0 1 Z" />
            <path d="M-10 -2 L0 3.5 L-10 9 L-20 3.5 Z" />
            <path d="M-20 3.5 L-10 9 V14 L-20 8.5 Z" />
            <path d="M-10 9 L0 3.5 V8.5 L-10 14 Z" />
            <path d="M10 -2 L20 3.5 L10 9 L0 3.5 Z" />
            <path d="M0 3.5 L10 9 V14 L0 8.5 Z" />
            <path d="M10 9 L20 3.5 V8.5 L10 14 Z" />
          </g>
        );

      case 'structural':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M-13 4 C-13 -9, 13 -9, 13 4 Z" />
            <path d="M-17 5 C-17 3, 17 3, 17 5 L15 8 C15 8, -15 8, -15 8 Z" />
            <path d="M-3 -8 C-3 -12, 3 -12, 3 -8 V-2" />
            <path d="M-9 1 C-5 -1, 5 -1, 9 1" strokeWidth="1.2" />
          </g>
        );

      case 'interior':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M10 -15 L16 -6 H4 Z" />
            <path d="M10 -6 V13" />
            <path d="M5 13 H15" />
            <path d="M-17 -1 H-2 V7 H-17 Z" />
            <path d="M-19 2 H-17 V8 H-19 Z" />
            <path d="M-2 2 H0 V8 H-2 Z" />
            <path d="M-18 8 H-1 V12 H-18 Z" />
            <path d="M-15 12 L-16 15 M-4 12 L-3 15" />
          </g>
        );

      case 'mep':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="-5" cy="4" r="8" />
            <circle cx="-5" cy="4" r="3" />
            <path d="M-5 -6 V-4 M-5 12 V14 M-15 4 H-13 M3 4 H5 M-12 -3 L-10.5 -1.5 M0.5 9.5 L2 11 M-12 11 L-10.5 9.5 M0.5 -1.5 L2 -3" />
            <circle cx="8" cy="-6" r="5" />
            <circle cx="8" cy="-6" r="1.8" />
            <path d="M8 -13 V-11 M8 -1 V1 M1 -6 H3 M13 -6 H15" />
          </g>
        );

      case 'vaasthu':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="0" cy="0" r="14" />
            <circle cx="0" cy="0" r="10.5" strokeDasharray="1.5 2" strokeWidth="1" />
            <path d="M0 -14 L2.5 -3 L14 0 L2.5 3 L0 14 L-2.5 3 L-14 0 L-2.5 -3 Z" />
            <circle cx="0" cy="0" r="2" fill={stroke} />
          </g>
        );

      case 'contractors':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M-9 -4 C-9 -13, 9 -13, 9 -4 Z" />
            <path d="M-12 -4 H12" />
            <path d="M-2 -12 V-7 M2 -12 V-7" strokeWidth="1.2" />
            <path d="M-6 -4 V1 C-6 4, 6 4, 6 1 V-4" />
            <path d="M-13 13 C-13 8, -6 6, -4 6 L0 10 L4 6 C6 6, 13 8, 13 13" />
            <path d="M-5 8 V13 M5 8 V13" strokeWidth="1.2" />
          </g>
        );

      case 'construction':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="-14" y="-5" width="18" height="18" />
            <path d="M-14 1 H4 M-14 7 H4" />
            <path d="M-5 -5 V1 M-5 7 V13" />
            <path d="M-10 1 V7 M-1 1 V7" />
            <path d="M7 -10 L16 -1 L8 4 Z" />
            <path d="M12 -5 L16 -9 L18 -7" />
          </g>
        );

      case 'finishing':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="-13" y="-12" width="22" height="9" rx="2" />
            <path d="M9 -8 H13 V2 H3 V9" />
            <rect x="1" y="9" width="4" height="7" rx="1" fill={stroke} />
            <path d="M-15 -15 H11" strokeWidth="2" strokeDasharray="3 2" />
          </g>
        );

      case 'electrical-plumbing':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M-14 -6 V-12 M-8 -6 V-12" />
            <path d="M-17 -6 H-5 V3 C-5 6, -17 6, -17 3 Z" />
            <path d="M-11 5 V12" />
            <path d="M10 -11 C10 -11, 2 -2, 2 5 C2 9.5, 5.5 13, 10 13 C14.5 13, 18 9.5, 18 5 C18 -2, 10 -11, 10 -11 Z" />
            <path d="M7 6 C7 8, 8.5 9.5, 10.5 9.5" strokeWidth="1.2" />
          </g>
        );

      case 'landscaping':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0 13 V-3 C0 -8, 4 -12, 10 -12" />
            <path d="M0 -3 C5 -10, 16 -10, 14 -2 C10 4, 3 1, 0 -3 Z" />
            <path d="M0 4 C-5 -3, -16 -3, -14 5 C-10 11, -3 8, 0 4 Z" />
            <path d="M-8 13 C-3 11, 3 11, 8 13" strokeWidth="1.2" />
          </g>
        );

      case 'resources':
        return (
          <g stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0 -15 L14 -7 L0 1 L-14 -7 Z" />
            <path d="M-14 -7 L0 1 V15 L-14 7 Z" />
            <path d="M0 1 L14 -7 V7 L0 15 Z" />
            <path d="M-7 -11 L7 -3" strokeWidth="1.2" />
            <path d="M0 -15 L0 1" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
          </g>
        );

      default:
        return null;
    }
  };

  /**
   * Precise per-sector layout:
   * Every line in a sector shares the EXACT SAME `centerX` so lines are
   * perfectly centered relative to each other as a single coherent block!
   */
  const getSectorLayout = (idx: number) => {
    switch (idx) {
      case 0: // ARCHITECTS (Top, -90°)
        return {
          centerX: 450,
          iconY: 110,
          startTextY: 168,
        };

      case 1: // MATERIAL SUPPLIERS & VENDORS (1 o'clock, -60°)
        return {
          centerX: 600,
          iconY: 140,
          startTextY: 190,
        };

      case 2: // STRUCTURAL / CIVIL ENGINEERS (2 o'clock, -30°)
        return {
          centerX: 710,
          iconY: 250,
          startTextY: 304,
        };

      case 3: // INTERIOR DESIGNERS (3 o'clock, 0°)
        return {
          centerX: 750,
          iconY: 412,
          startTextY: 464,
        };

      case 4: // MEP CONSULTANTS (4 o'clock, +30°)
        return {
          centerX: 710,
          iconY: 570,
          startTextY: 618,
        };

      case 5: // VAASTHU CONSULTANTS (5 o'clock, +60°)
        return {
          centerX: 608,
          iconY: 668,
          startTextY: 716,
        };

      case 6: // MAIN & SPECIALIST CONTRACTORS (6 o'clock, +90°)
        return {
          centerX: 450,
          iconY: 720,
          startTextY: 766,
        };

      case 7: // CIVIL CONSTRUCTION TEAMS (7 o'clock, +120°)
        return {
          centerX: 292,
          iconY: 668,
          startTextY: 716,
        };

      case 8: // INTERIOR & FINISHING TEAMS (8 o'clock, +150°)
        return {
          centerX: 190,
          iconY: 570,
          startTextY: 618,
        };

      case 9: // ELECTRICAL & PLUMBING TEAMS (9 o'clock, +180°)
        return {
          centerX: 150,
          iconY: 412,
          startTextY: 464,
        };

      case 10: // LANDSCAPING TEAMS (10 o'clock, +210°)
        return {
          centerX: 190,
          iconY: 250,
          startTextY: 304,
        };

      case 11: // SPECIALIST PROJECT RESOURCES (11 o'clock, +240°)
        return {
          centerX: 300,
          iconY: 140,
          startTextY: 194,
        };

      default:
        return {
          centerX: 450,
          iconY: 150,
          startTextY: 180,
        };
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      <svg
        viewBox="0 0 900 900"
        className="w-full h-auto max-w-[540px] select-none overflow-visible drop-shadow-sm"
        style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.03))' }}
      >
        <defs>
          <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="90%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FAF8F5" />
          </radialGradient>
        </defs>

        {/* Outer Circular Boundary Line */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke="#DED9CC"
          strokeWidth="1.5"
        />

        {/* 12 Annular Sectors */}
        <g>
          {disciplines.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const pathData = getSectorPath(idx);
            const { centerX, iconY, startTextY } = getSectorLayout(idx);

            const linesCount = item.lines.length;
            // Larger, bolder font sizes for high mobile clarity
            const fontSize = linesCount === 3 ? '15px' : linesCount === 2 ? '16.5px' : '18px';
            const lineHeight = linesCount === 3 ? 18.5 : 20.5;

            // Radial pop-up offset outward from center
            const midDeg = -90 + idx * 30;
            const midRad = (midDeg * Math.PI) / 180;
            const popDist = isHovered ? 12 : 0;
            const popX = Math.round(popDist * Math.cos(midRad));
            const popY = Math.round(popDist * Math.sin(midRad));

            return (
              <g
                key={item.id}
                className="transition-all duration-300 ease-out cursor-pointer"
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  if (onDisciplineHover) onDisciplineHover(item.label);
                }}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  if (onDisciplineHover) onDisciplineHover(null);
                }}
                onClick={() => {
                  setHoveredIdx(hoveredIdx === idx ? null : idx);
                }}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: isHovered
                    ? `translate(${popX}px, ${popY}px) scale(1.025)`
                    : 'translate(0px, 0px) scale(1)',
                  filter: isHovered
                    ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))'
                    : 'none',
                }}
              >
                {/* Sector Wedge */}
                <path
                  d={pathData}
                  fill={item.bgColor}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="transition-all duration-200"
                  style={{
                    filter: isHovered ? 'brightness(1.12)' : 'none',
                    opacity: hoveredIdx !== null && !isHovered ? 0.88 : 1,
                  }}
                />

                {/* Vector Icon */}
                <g
                  transform={`translate(${centerX}, ${iconY}) scale(1.08)`}
                  className="pointer-events-none transition-transform duration-200"
                  style={{
                    transformOrigin: '0 0',
                    transform: isHovered
                      ? `translate(${centerX}px, ${iconY}px) scale(1.2)`
                      : `translate(${centerX}px, ${iconY}px) scale(1.08)`,
                  }}
                >
                  {renderIcon(item.icon, item.iconStroke)}
                </g>

                {/* Multiline Text Label - High clarity & bold weight */}
                <text
                  x={centerX}
                  textAnchor="middle"
                  className="pointer-events-none select-none uppercase font-extrabold"
                  style={{
                    fontFamily:
                      'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
                    fontSize,
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    fill: item.textColor,
                  }}
                >
                  {item.lines.map((line, lIdx) => (
                    <tspan
                      key={lIdx}
                      x={centerX}
                      y={startTextY + lIdx * lineHeight}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>

        {/* Thin crisp radial divider lines between sectors */}
        <g pointerEvents="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const deg = -105 + i * 30;
            const rad = (deg * Math.PI) / 180;
            const x1 = cx + rInner * Math.cos(rad);
            const y1 = cy + rInner * Math.sin(rad);
            const x2 = cx + rOuter * Math.cos(rad);
            const y2 = cy + rOuter * Math.sin(rad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FAF8F5"
                strokeWidth="2"
              />
            );
          })}
        </g>

        {/* Central White Hub */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="url(#hubGradient)"
          stroke={hoveredIdx !== null ? '#5A663E' : '#E2DDD2'}
          strokeWidth={hoveredIdx !== null ? '3' : '2'}
          className="shadow-inner cursor-pointer transition-colors duration-300"
          onClick={() => setHoveredIdx(null)}
        />

        {/* Inner Hub Subtle Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner - 6}
          fill="none"
          stroke={hoveredIdx !== null ? '#5A663E/30' : '#EFEBE3'}
          strokeWidth="1"
          className="transition-colors duration-300"
        />

        {/* Central Content 1: Default State (PROJETO Brand + Central Coordination Core) */}
        <g
          className="pointer-events-none transition-all duration-300"
          style={{
            opacity: hoveredIdx === null ? 1 : 0,
            transformOrigin: `${cx}px ${cy}px`,
            transform: hoveredIdx === null ? 'scale(1)' : 'scale(0.9)',
          }}
        >
          {/* Logo image */}
          <image
            href="/projecto-logo-dark.png"
            x={cx - 120}
            y={cy - 44}
            width={240}
            height={52}
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Subtitle CENTRAL COORDINATION CORE with high contrast and legible mobile sizing */}
          <text
            x={cx}
            y={cy + 34}
            textAnchor="middle"
            style={{
              fontFamily:
                'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.24em',
              fill: '#1B1E1B',
            }}
          >
            CENTRAL COORDINATION CORE
          </text>

          {/* Micro tag underneath for extra clarity */}
          <text
            x={cx}
            y={cy + 56}
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9.5px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              fill: '#6F756B',
            }}
          >
            SINGLE POINT OF CONTACT
          </text>
        </g>

        {/* Central Content 2: Hovered/Tapped Discipline Pop-Up Card */}
        {hoveredIdx !== null && disciplines[hoveredIdx] && (
          <g
            className="pointer-events-none transition-all duration-300"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            {/* Subtle background glow circle in discipline color */}
            <circle
              cx={cx}
              cy={cy}
              r={rInner - 12}
              fill={disciplines[hoveredIdx].bgColor}
              opacity={0.14}
            />

            {/* Discipline enlarged icon */}
            <g
              transform={`translate(${cx}, ${cy - 52}) scale(1.45)`}
              style={{ transformOrigin: '0 0' }}
            >
              {renderIcon(disciplines[hoveredIdx].icon, '#5A663E')}
            </g>

            {/* Discipline index pill badge */}
            <rect
              x={cx - 60}
              y={cy - 20}
              width={120}
              height={20}
              rx={10}
              fill="#222724"
            />
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                fill: '#FFFFFF',
              }}
            >
              {`DISCIPLINE ${((hoveredIdx ?? 0) + 1).toString().padStart(2, '0')}/12`}
            </text>

            {/* Discipline full title in large bold letters */}
            <text
              x={cx}
              textAnchor="middle"
              style={{
                fontFamily:
                  'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
                fontSize: disciplines[hoveredIdx].lines.length === 3 ? '15px' : '17px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                fill: '#181B18',
              }}
            >
              {disciplines[hoveredIdx].lines.map((line, lIdx) => (
                <tspan
                  key={lIdx}
                  x={cx}
                  y={cy + 18 + lIdx * (disciplines[hoveredIdx].lines.length === 3 ? 17 : 20)}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
