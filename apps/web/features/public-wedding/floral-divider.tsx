export type DividerStyle = 'classic' | 'minimal' | 'ornate' | 'dots' | 'none';
export type DividerSize = 'small' | 'medium' | 'large';

const sizeMultiplier: Record<DividerSize, number> = {
  small: 0.6,
  medium: 1,
  large: 1.4,
};

interface FloralDividerProps {
  className?: string;
  style?: DividerStyle;
  size?: DividerSize;
}

export function FloralDivider({ className = '', style = 'classic', size = 'medium' }: FloralDividerProps) {
  if (style === 'none') return null;

  const mult = sizeMultiplier[size] ?? 1;
  const sizeStyle = mult !== 1 ? { transform: `scale(${mult})`, transformOrigin: 'center' } : undefined;

  return (
    <div className={`flex items-center justify-center py-2 overflow-hidden ${className}`}>
      <div style={sizeStyle}>
        {style === 'classic' && <ClassicDivider />}
        {style === 'minimal' && <MinimalDivider />}
        {style === 'ornate' && <OrnateDivider />}
        {style === 'dots' && <DotsDivider />}
      </div>
    </div>
  );
}

/* ── Classic: floral branches with center flower ── */
function ClassicDivider() {
  return (
    <svg viewBox="0 0 400 60" className="w-64 md:w-80 h-auto" fill="none" aria-hidden="true">
      <g opacity="0.5">
        <path d="M200 30 Q160 28 120 22 Q90 18 60 24 Q40 28 20 26"
              stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
        <ellipse cx="80" cy="20" rx="12" ry="5" transform="rotate(-20 80 20)" fill="var(--wedding-primary)" opacity="0.15" />
        <ellipse cx="100" cy="24" rx="10" ry="4" transform="rotate(10 100 24)" fill="var(--wedding-primary)" opacity="0.12" />
        <ellipse cx="55" cy="25" rx="11" ry="4.5" transform="rotate(-10 55 25)" fill="var(--wedding-primary)" opacity="0.13" />
        <ellipse cx="140" cy="26" rx="9" ry="3.5" transform="rotate(15 140 26)" fill="var(--wedding-primary)" opacity="0.1" />
        <circle cx="45" cy="24" r="3" fill="var(--wedding-primary)" opacity="0.2" />
        <circle cx="30" cy="26" r="2" fill="var(--wedding-primary)" opacity="0.15" />
      </g>
      <g>
        <ellipse cx="200" cy="26" rx="5" ry="9" fill="var(--wedding-primary)" opacity="0.2" />
        <ellipse cx="200" cy="26" rx="5" ry="9" fill="var(--wedding-primary)" opacity="0.2" transform="rotate(60 200 26)" />
        <ellipse cx="200" cy="26" rx="5" ry="9" fill="var(--wedding-primary)" opacity="0.2" transform="rotate(120 200 26)" />
        <circle cx="200" cy="26" r="3" fill="var(--wedding-primary)" opacity="0.35" />
        <circle cx="170" cy="28" r="4" fill="var(--wedding-primary)" opacity="0.15" />
        <circle cx="170" cy="28" r="2" fill="var(--wedding-primary)" opacity="0.25" />
        <circle cx="230" cy="28" r="4" fill="var(--wedding-primary)" opacity="0.15" />
        <circle cx="230" cy="28" r="2" fill="var(--wedding-primary)" opacity="0.25" />
      </g>
      <g opacity="0.5">
        <path d="M200 30 Q240 28 280 22 Q310 18 340 24 Q360 28 380 26"
              stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
        <ellipse cx="320" cy="20" rx="12" ry="5" transform="rotate(20 320 20)" fill="var(--wedding-primary)" opacity="0.15" />
        <ellipse cx="300" cy="24" rx="10" ry="4" transform="rotate(-10 300 24)" fill="var(--wedding-primary)" opacity="0.12" />
        <ellipse cx="345" cy="25" rx="11" ry="4.5" transform="rotate(10 345 25)" fill="var(--wedding-primary)" opacity="0.13" />
        <ellipse cx="260" cy="26" rx="9" ry="3.5" transform="rotate(-15 260 26)" fill="var(--wedding-primary)" opacity="0.1" />
        <circle cx="355" cy="24" r="3" fill="var(--wedding-primary)" opacity="0.2" />
        <circle cx="370" cy="26" r="2" fill="var(--wedding-primary)" opacity="0.15" />
      </g>
    </svg>
  );
}

/* ── Minimal: thin line with center diamond ── */
function MinimalDivider() {
  return (
    <svg viewBox="0 0 400 30" className="w-48 md:w-64 h-auto" fill="none" aria-hidden="true">
      <line x1="40" y1="15" x2="185" y2="15" stroke="var(--wedding-primary)" strokeWidth="0.5" opacity="0.3" />
      <rect x="194" y="9" width="12" height="12" rx="1" transform="rotate(45 200 15)"
            fill="var(--wedding-primary)" opacity="0.25" />
      <line x1="215" y1="15" x2="360" y2="15" stroke="var(--wedding-primary)" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ── Ornate: elegant scrollwork flourish ── */
function OrnateDivider() {
  return (
    <svg viewBox="0 0 400 50" className="w-64 md:w-80 h-auto" fill="none" aria-hidden="true">
      {/* Left scroll */}
      <path
        d="M200 25 Q180 25 165 18 Q150 11 140 18 Q130 25 140 32 Q148 37 155 32 Q160 28 155 24"
        stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4"
      />
      <path
        d="M140 18 Q125 8 110 15 Q100 20 110 28 Q118 33 122 26"
        stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3"
      />
      <path
        d="M110 15 Q95 5 80 14 Q72 20 80 27 Q86 30 90 25"
        stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.2"
      />
      {/* Right scroll (mirrored) */}
      <path
        d="M200 25 Q220 25 235 18 Q250 11 260 18 Q270 25 260 32 Q252 37 245 32 Q240 28 245 24"
        stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4"
      />
      <path
        d="M260 18 Q275 8 290 15 Q300 20 290 28 Q282 33 278 26"
        stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3"
      />
      <path
        d="M290 15 Q305 5 320 14 Q328 20 320 27 Q314 30 310 25"
        stroke="var(--wedding-primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.2"
      />
      {/* Center ornament */}
      <circle cx="200" cy="25" r="3" fill="var(--wedding-primary)" opacity="0.3" />
      <circle cx="200" cy="25" r="6" stroke="var(--wedding-primary)" strokeWidth="0.5" fill="none" opacity="0.2" />
    </svg>
  );
}

/* ── Dots: three elegant dots ── */
function DotsDivider() {
  return (
    <svg viewBox="0 0 400 20" className="w-32 md:w-40 h-auto" fill="none" aria-hidden="true">
      <circle cx="185" cy="10" r="2" fill="var(--wedding-primary)" opacity="0.25" />
      <circle cx="200" cy="10" r="3" fill="var(--wedding-primary)" opacity="0.4" />
      <circle cx="215" cy="10" r="2" fill="var(--wedding-primary)" opacity="0.25" />
    </svg>
  );
}
