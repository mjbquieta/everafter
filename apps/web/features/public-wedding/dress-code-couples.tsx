interface CoupleProps {
  suitColor: string;
  dressColor: string;
  accentColor: string;
  x: number;
  variant: number;
}

function Man({
  x,
  suitColor,
  accentColor,
  variant,
}: {
  x: number;
  suitColor: string;
  accentColor: string;
  variant: number;
}) {
  const skin = '#C9A882';
  const hair = '#3B2314';
  const shoe = '#1A1A1A';

  if (variant === 0) {
    // Standing straight, one hand in pocket
    return (
      <g transform={`translate(${x}, 0)`}>
        {/* Hair back */}
        <ellipse cx="25" cy="18" rx="11" ry="10" fill={hair} />
        {/* Head */}
        <ellipse cx="25" cy="22" rx="9" ry="11" fill={skin} />
        {/* Hair top/side */}
        <path d="M16,18 Q16,10 25,9 Q34,10 34,18 Q32,14 25,13 Q18,14 16,18Z" fill={hair} />
        {/* Neck */}
        <rect x="22" y="32" width="6" height="6" fill={skin} />
        {/* Jacket */}
        <path
          d="M10,38 Q12,35 22,34 L28,34 Q38,35 40,38 L42,80 Q42,82 40,82 L10,82 Q8,82 8,80Z"
          fill={suitColor}
        />
        {/* Lapels */}
        <path d="M22,34 L25,38 L20,58 L16,38Z" fill={suitColor} stroke="#00000020" strokeWidth="0.5" />
        <path d="M28,34 L25,38 L30,58 L34,38Z" fill={suitColor} stroke="#00000020" strokeWidth="0.5" />
        {/* Shirt V */}
        <path d="M22,34 L25,50 L28,34Z" fill="#FFFFFF" />
        {/* Tie */}
        <path d="M24.2,38 L25.8,38 L26.2,54 L25,56 L23.8,54Z" fill={accentColor} />
        {/* Tie knot */}
        <ellipse cx="25" cy="37" rx="2" ry="1.5" fill={accentColor} />
        {/* Pocket square */}
        <path d="M33,46 L37,44 L37,48 L34,48Z" fill={accentColor} opacity="0.7" />
        {/* Left arm (by side) */}
        <path
          d="M10,38 Q5,42 4,60 Q3,65 5,68 Q7,66 7,60 Q7,50 12,42"
          fill={suitColor}
        />
        <ellipse cx="5" cy="68" rx="3" ry="2.5" fill={skin} />
        {/* Right arm (hand in pocket) */}
        <path
          d="M40,38 Q44,42 43,58 Q42,62 38,64"
          fill={suitColor}
          stroke={suitColor}
          strokeWidth="2"
        />
        {/* Belt */}
        <rect x="10" y="80" width="30" height="3" rx="1" fill="#1A1A1A" />
        <rect x="23" y="80" width="4" height="3" rx="0.5" fill="#C0A060" />
        {/* Pants */}
        <path d="M12,83 L14,140 Q14,142 17,142 L21,142 Q23,142 22,140 L24,83Z" fill={suitColor} opacity="0.88" />
        <path d="M26,83 L28,140 Q28,142 30,142 L34,142 Q36,142 36,140 L38,83Z" fill={suitColor} opacity="0.88" />
        {/* Crease lines */}
        <line x1="18" y1="90" x2="18" y2="138" stroke="#00000010" strokeWidth="0.5" />
        <line x1="32" y1="90" x2="32" y2="138" stroke="#00000010" strokeWidth="0.5" />
        {/* Shoes */}
        <path d="M14,140 Q12,142 12,144 Q12,147 18,147 L22,147 Q24,147 24,144 Q24,142 22,140Z" fill={shoe} />
        <path d="M28,140 Q26,142 26,144 Q26,147 32,147 L36,147 Q38,147 38,144 Q38,142 36,140Z" fill={shoe} />
      </g>
    );
  }

  if (variant === 1) {
    // Slightly turned, buttoning jacket
    return (
      <g transform={`translate(${x}, 0)`}>
        <ellipse cx="25" cy="18" rx="11" ry="10" fill={hair} />
        <ellipse cx="25" cy="22" rx="9" ry="11" fill={skin} />
        <path d="M16,18 Q17,8 25,8 Q33,8 34,18 Q31,13 25,12 Q19,13 16,18Z" fill={hair} />
        <rect x="22" y="32" width="6" height="6" fill={skin} />
        {/* Jacket — slightly angled */}
        <path
          d="M9,38 Q11,35 21,34 L29,34 Q39,35 41,38 L43,78 Q43,80 41,81 L9,81 Q7,81 7,79Z"
          fill={suitColor}
        />
        {/* Lapels */}
        <path d="M21,34 L25,40 L19,56 L14,38Z" fill={suitColor} stroke="#00000020" strokeWidth="0.5" />
        <path d="M29,34 L25,40 L31,56 L36,38Z" fill={suitColor} stroke="#00000020" strokeWidth="0.5" />
        <path d="M21,34 L25,52 L29,34Z" fill="#F5F5F0" />
        {/* Buttons */}
        <circle cx="25" cy="54" r="1.2" fill="#00000030" />
        <circle cx="25" cy="62" r="1.2" fill="#00000030" />
        {/* Left arm */}
        <path d="M9,38 Q4,44 3,58 Q2,64 5,66 Q7,64 6,58 Q6,48 11,42" fill={suitColor} />
        <ellipse cx="5" cy="66" rx="3" ry="2.5" fill={skin} />
        {/* Right arm — reaching to button */}
        <path d="M41,38 Q45,44 40,58 Q38,62 30,58" fill={suitColor} />
        <ellipse cx="29" cy="57" rx="3" ry="2.5" fill={skin} />
        {/* Belt */}
        <rect x="9" y="79" width="32" height="3" rx="1" fill="#1A1A1A" />
        <rect x="23" y="79" width="4" height="3" rx="0.5" fill="#C0A060" />
        {/* Pants */}
        <path d="M11,82 L13,140 Q13,142 16,142 L21,142 Q23,142 22,140 L24,82Z" fill={suitColor} opacity="0.88" />
        <path d="M26,82 L28,140 Q28,142 30,142 L35,142 Q37,142 37,140 L39,82Z" fill={suitColor} opacity="0.88" />
        <line x1="17" y1="88" x2="17" y2="138" stroke="#00000010" strokeWidth="0.5" />
        <line x1="33" y1="88" x2="33" y2="138" stroke="#00000010" strokeWidth="0.5" />
        {/* Shoes */}
        <path d="M13,140 Q11,142 11,144 Q11,147 17,147 L22,147 Q24,147 24,144 Q24,142 22,140Z" fill={shoe} />
        <path d="M28,140 Q26,142 26,144 Q26,147 32,147 L36,147 Q38,147 38,144 Q38,142 37,140Z" fill={shoe} />
      </g>
    );
  }

  // variant 2: relaxed, arms crossed
  return (
    <g transform={`translate(${x}, 0)`}>
      <ellipse cx="25" cy="18" rx="11" ry="10" fill={hair} />
      <ellipse cx="25" cy="22" rx="9" ry="11" fill={skin} />
      <path d="M16,17 Q18,9 25,8 Q32,9 34,17 Q31,12 25,11 Q19,12 16,17Z" fill={hair} />
      <rect x="22" y="32" width="6" height="6" fill={skin} />
      {/* Jacket */}
      <path
        d="M8,38 Q10,35 21,34 L29,34 Q40,35 42,38 L44,80 Q44,82 42,82 L8,82 Q6,82 6,80Z"
        fill={suitColor}
      />
      <path d="M21,34 L25,40 L18,58 L13,38Z" fill={suitColor} stroke="#00000020" strokeWidth="0.5" />
      <path d="M29,34 L25,40 L32,58 L37,38Z" fill={suitColor} stroke="#00000020" strokeWidth="0.5" />
      <path d="M21,34 L25,52 L29,34Z" fill="#FFFFFF" />
      <path d="M24.2,38 L25.8,38 L26.2,54 L25,56 L23.8,54Z" fill={accentColor} />
      <ellipse cx="25" cy="37" rx="2" ry="1.5" fill={accentColor} />
      {/* Arms crossed */}
      <path d="M8,38 Q3,44 6,56 Q8,60 18,58 Q22,56 20,52 Q14,48 12,44" fill={suitColor} />
      <path d="M42,38 Q47,44 44,56 Q42,60 32,58 Q28,56 30,52 Q36,48 38,44" fill={suitColor} />
      <ellipse cx="18" cy="58" rx="3" ry="2.5" fill={skin} />
      <ellipse cx="32" cy="58" rx="3" ry="2.5" fill={skin} />
      {/* Belt */}
      <rect x="8" y="80" width="34" height="3" rx="1" fill="#1A1A1A" />
      <rect x="23" y="80" width="4" height="3" rx="0.5" fill="#C0A060" />
      {/* Pants */}
      <path d="M10,83 L12,140 Q12,142 15,142 L20,142 Q22,142 22,140 L24,83Z" fill={suitColor} opacity="0.88" />
      <path d="M26,83 L28,140 Q28,142 31,142 L36,142 Q38,142 38,140 L40,83Z" fill={suitColor} opacity="0.88" />
      <line x1="16" y1="90" x2="16" y2="138" stroke="#00000010" strokeWidth="0.5" />
      <line x1="34" y1="90" x2="34" y2="138" stroke="#00000010" strokeWidth="0.5" />
      {/* Shoes */}
      <path d="M12,140 Q10,142 10,144 Q10,147 16,147 L21,147 Q23,147 23,144 Q23,142 22,140Z" fill={shoe} />
      <path d="M28,140 Q26,142 26,144 Q26,147 32,147 L37,147 Q39,147 39,144 Q39,142 38,140Z" fill={shoe} />
    </g>
  );
}

function Woman({
  x,
  dressColor,
  accentColor,
  variant,
}: {
  x: number;
  dressColor: string;
  accentColor: string;
  variant: number;
}) {
  const skin = '#DBBF9C';
  const hair = '#2A1810';
  const shoe = '#1A1A1A';

  if (variant === 0) {
    // Elegant long gown, hands clasped in front
    return (
      <g transform={`translate(${x}, 0)`}>
        {/* Hair behind */}
        <path d="M12,16 Q12,4 25,3 Q38,4 38,16 Q38,30 34,36 L16,36 Q12,30 12,16Z" fill={hair} />
        {/* Head */}
        <ellipse cx="25" cy="22" rx="9" ry="11" fill={skin} />
        {/* Hair front */}
        <path d="M16,18 Q17,11 25,10 Q33,11 34,18 Q32,15 25,14 Q18,15 16,18Z" fill={hair} />
        {/* Hair side flowing */}
        <path d="M14,20 Q10,22 9,32 Q8,38 12,36 Q13,28 15,24Z" fill={hair} />
        {/* Earring */}
        <circle cx="15.5" cy="26" r="1" fill={accentColor} />
        {/* Neck */}
        <rect x="22" y="32" width="6" height="5" fill={skin} />
        {/* Necklace */}
        <path d="M20,35 Q25,39 30,35" fill="none" stroke={accentColor} strokeWidth="0.8" />
        <circle cx="25" cy="38" r="1.2" fill={accentColor} />
        {/* Dress bodice */}
        <path
          d="M14,37 Q16,34 22,34 L28,34 Q34,34 36,37 L38,60 L12,60Z"
          fill={dressColor}
        />
        {/* Sweetheart neckline */}
        <path d="M18,36 Q22,40 25,37 Q28,40 32,36 L34,34 Q30,33 28,34 L22,34 Q20,33 16,34Z" fill={dressColor} />
        <path d="M19,36 Q22,39 25,37 Q28,39 31,36" fill="none" stroke={skin} strokeWidth="0.5" />
        {/* Waist belt/sash */}
        <path d="M12,58 Q25,62 38,58 L38,61 Q25,65 12,61Z" fill={accentColor} opacity="0.5" />
        {/* Skirt — flowing A-line */}
        <path
          d="M12,60 Q10,80 6,110 Q4,130 8,144 Q15,148 25,149 Q35,148 42,144 Q46,130 44,110 Q40,80 38,60Z"
          fill={dressColor}
        />
        {/* Skirt drape lines */}
        <path d="M18,65 Q16,100 14,140" fill="none" stroke="#00000008" strokeWidth="1" />
        <path d="M32,65 Q34,100 36,140" fill="none" stroke="#00000008" strokeWidth="1" />
        <path d="M25,62 Q25,100 25,145" fill="none" stroke="#00000008" strokeWidth="0.5" />
        {/* Arms — clasped in front */}
        <path d="M14,37 Q8,42 7,52 Q6,56 10,58 Q14,56 12,50 Q12,46 15,41" fill={skin} />
        <path d="M36,37 Q42,42 43,52 Q44,56 40,58 Q36,56 38,50 Q38,46 35,41" fill={skin} />
        {/* Hands clasped */}
        <ellipse cx="22" cy="62" rx="4" ry="2.5" fill={skin} />
        {/* Clutch/small bag */}
        <rect x="19" y="61" width="8" height="4" rx="2" fill={accentColor} opacity="0.6" />
        {/* Shoes peek */}
        <ellipse cx="20" cy="147" rx="5" ry="2" fill={shoe} />
        <ellipse cx="30" cy="147" rx="5" ry="2" fill={shoe} />
      </g>
    );
  }

  if (variant === 1) {
    // Cocktail/midi dress, one hand on hip
    return (
      <g transform={`translate(${x}, 0)`}>
        {/* Hair bun */}
        <ellipse cx="25" cy="12" rx="8" ry="7" fill={hair} />
        <circle cx="25" cy="8" r="5" fill={hair} />
        {/* Head */}
        <ellipse cx="25" cy="22" rx="9" ry="11" fill={skin} />
        {/* Hair front */}
        <path d="M16,20 Q17,13 25,12 Q33,13 34,20 Q31,16 25,15 Q19,16 16,20Z" fill={hair} />
        {/* Earring */}
        <circle cx="34" cy="25" r="1" fill={accentColor} />
        {/* Neck */}
        <rect x="22" y="32" width="6" height="5" fill={skin} />
        {/* Dress bodice — off-shoulder */}
        <path
          d="M10,40 Q14,34 22,35 L28,35 Q36,34 40,40 L40,62 L10,62Z"
          fill={dressColor}
        />
        {/* Off-shoulder straps */}
        <path d="M10,40 Q8,38 6,40 Q8,42 10,40" fill={dressColor} />
        <path d="M40,40 Q42,38 44,40 Q42,42 40,40" fill={dressColor} />
        {/* Shoulders bare */}
        <path d="M14,36 Q18,34 22,35 L22,37 Q18,36 15,38Z" fill={skin} />
        <path d="M36,36 Q32,34 28,35 L28,37 Q32,36 35,38Z" fill={skin} />
        {/* Waist */}
        <path d="M10,60 Q25,64 40,60 L40,63 Q25,67 10,63Z" fill={accentColor} opacity="0.4" />
        {/* Skirt — midi, fitted */}
        <path
          d="M10,62 Q8,80 7,100 Q6,115 10,120 Q15,124 25,125 Q35,124 40,120 Q44,115 43,100 Q42,80 40,62Z"
          fill={dressColor}
        />
        <path d="M20,65 Q18,90 16,118" fill="none" stroke="#00000008" strokeWidth="1" />
        <path d="M30,65 Q32,90 34,118" fill="none" stroke="#00000008" strokeWidth="1" />
        {/* Left arm by side */}
        <path d="M10,40 Q4,46 3,58 Q2,62 5,64 Q7,62 6,58 Q6,50 11,44" fill={skin} />
        <ellipse cx="5" cy="64" rx="2.5" ry="2" fill={skin} />
        {/* Right arm on hip */}
        <path d="M40,40 Q46,46 44,56 Q42,60 38,62" fill={skin} />
        <ellipse cx="38" cy="62" rx="2.5" ry="2" fill={skin} />
        {/* Legs */}
        <path d="M15,122 L14,140 Q14,142 16,142 L20,142 Q22,142 22,140 L22,122" fill={skin} />
        <path d="M28,122 L28,140 Q28,142 30,142 L34,142 Q36,142 36,140 L36,122" fill={skin} />
        {/* Heels */}
        <path d="M13,140 Q11,142 12,145 Q12,147 18,147 L22,147 Q24,147 24,144 L24,140Z" fill={shoe} />
        <path d="M27,140 Q25,142 26,145 Q26,147 32,147 L36,147 Q38,147 38,144 L38,140Z" fill={shoe} />
        {/* Heel stiletto */}
        <line x1="14" y1="145" x2="13" y2="148" stroke={shoe} strokeWidth="1.5" />
        <line x1="28" y1="145" x2="27" y2="148" stroke={shoe} strokeWidth="1.5" />
      </g>
    );
  }

  // variant 2: Flowing wrap dress, relaxed pose
  return (
    <g transform={`translate(${x}, 0)`}>
      {/* Long hair flowing */}
      <path d="M14,14 Q14,4 25,3 Q36,4 36,14 Q36,34 40,42 L38,42 Q35,34 34,26 L16,26 Q15,34 12,42 L10,42 Q14,34 14,14Z" fill={hair} />
      {/* Head */}
      <ellipse cx="25" cy="22" rx="9" ry="11" fill={skin} />
      {/* Hair front */}
      <path d="M16,18 Q18,10 25,9 Q32,10 34,18 Q31,14 25,13 Q19,14 16,18Z" fill={hair} />
      {/* Earring */}
      <circle cx="15" cy="26" r="1" fill={accentColor} />
      {/* Neck */}
      <rect x="22" y="32" width="6" height="5" fill={skin} />
      {/* Dress — wrap style V-neck */}
      <path
        d="M12,37 Q16,34 22,34 L28,34 Q34,34 38,37 L40,58 L10,58Z"
        fill={dressColor}
      />
      {/* V neckline */}
      <path d="M18,35 L25,48 L32,35" fill="none" stroke={skin} strokeWidth="1.5" />
      <path d="M18,35 L25,48" fill={dressColor} stroke="#00000010" strokeWidth="0.3" />
      <path d="M32,35 L25,48" fill={dressColor} stroke="#00000010" strokeWidth="0.3" />
      {/* Wrap tie at waist */}
      <path d="M10,56 Q25,60 40,56 L40,59 Q25,63 10,59Z" fill={accentColor} opacity="0.4" />
      {/* Bow/tie detail */}
      <path d="M34,57 Q38,54 40,56 Q38,58 34,57" fill={accentColor} opacity="0.6" />
      <path d="M34,57 Q38,60 40,58 Q38,56 34,57" fill={accentColor} opacity="0.6" />
      {/* Flowing skirt */}
      <path
        d="M10,58 Q6,80 3,110 Q2,130 6,144 Q14,150 25,150 Q36,150 44,144 Q48,130 47,110 Q44,80 40,58Z"
        fill={dressColor}
      />
      {/* Flowing drape lines */}
      <path d="M15,62 Q12,90 8,142" fill="none" stroke="#00000008" strokeWidth="1.2" />
      <path d="M35,62 Q38,90 42,142" fill="none" stroke="#00000008" strokeWidth="1.2" />
      <path d="M25,60 Q25,100 24,148" fill="none" stroke="#00000006" strokeWidth="0.8" />
      {/* Left arm relaxed */}
      <path d="M12,37 Q6,44 5,56 Q4,60 7,62 Q9,60 8,56 Q8,48 13,42" fill={skin} />
      <ellipse cx="7" cy="62" rx="2.5" ry="2" fill={skin} />
      {/* Right arm slightly out */}
      <path d="M38,37 Q44,44 45,56 Q46,60 43,62 Q41,60 42,56 Q42,48 37,42" fill={skin} />
      <ellipse cx="43" cy="62" rx="2.5" ry="2" fill={skin} />
      {/* Shoes peek */}
      <ellipse cx="18" cy="148" rx="5" ry="2" fill={shoe} />
      <ellipse cx="32" cy="148" rx="5" ry="2" fill={shoe} />
    </g>
  );
}

function Couple({ x, suitColor, dressColor, accentColor, variant }: CoupleProps) {
  return (
    <g>
      <Man x={x} suitColor={suitColor} accentColor={accentColor} variant={variant} />
      <Woman x={x + 50} dressColor={dressColor} accentColor={accentColor} variant={variant} />
    </g>
  );
}

interface DressCodeCouplesProps {
  colors: string[];
  primaryColor: string;
}

const DEFAULT_COLORS = ['#2C3E50', '#8B5E5E', '#D4A574'];

export function DressCodeCouples({ colors, primaryColor }: DressCodeCouplesProps) {
  const palette = colors.length >= 3 ? colors : DEFAULT_COLORS;

  const couples = [
    { suitColor: palette[0], dressColor: palette[1], accentColor: palette[2] ?? primaryColor },
    { suitColor: palette[1], dressColor: palette[2] ?? palette[0], accentColor: palette[0] },
    { suitColor: palette[2] ?? palette[0], dressColor: palette[0], accentColor: palette[1] },
  ];

  const coupleWidth = 100;
  const gap = 30;
  const totalWidth = coupleWidth * 3 + gap * 2;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 155`}
      className="w-full max-w-xl mx-auto"
      aria-label="Dress code illustration showing three couples"
    >
      {couples.map((c, i) => (
        <Couple
          key={i}
          x={i * (coupleWidth + gap)}
          suitColor={c.suitColor}
          dressColor={c.dressColor}
          accentColor={c.accentColor}
          variant={i}
        />
      ))}
    </svg>
  );
}
