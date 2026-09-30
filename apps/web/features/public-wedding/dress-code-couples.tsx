interface ColorSwatch {
  name: string;
  hex: string;
}

type ColorInput = string | { hex: string; name: string };

interface DressCodeCouplesProps {
  colors: ColorInput[];
  primaryColor: string;
}

const DEFAULT_PALETTE: ColorSwatch[] = [
  { name: 'Terracotta', hex: '#C47C5D' },
  { name: 'Warm Sand', hex: '#D6C7B2' },
  { name: 'Sage', hex: '#8A9A86' },
  { name: 'Charcoal', hex: '#2C2825' },
  { name: 'Ivory', hex: '#FAF8F5' },
];

// Simple color name lookup for common wedding colors
const COLOR_NAMES: Record<string, string> = {
  '#C47C5D': 'Terracotta',
  '#D6C7B2': 'Warm Sand',
  '#8A9A86': 'Sage',
  '#2C2825': 'Charcoal',
  '#FAF8F5': 'Ivory',
  '#8B5E5E': 'Dusty Rose',
  '#2C3E50': 'Navy',
  '#D4A574': 'Gold',
  '#5B84B1': 'Dusty Blue',
  '#A97C73': 'Rosewood',
};

function normalizeColor(color: ColorInput, index: number): ColorSwatch {
  if (typeof color === 'string') {
    // Backward compatibility: convert hex string to swatch with name
    const upperHex = color.toUpperCase();
    const name = COLOR_NAMES[upperHex] || COLOR_NAMES[color.toLowerCase()] || `Color ${index + 1}`;
    return { hex: color, name };
  }
  // Already an object with hex and name
  return color;
}

export function DressCodeCouples({ colors, primaryColor }: DressCodeCouplesProps) {
  // Build palette from provided colors or use defaults
  const palette: ColorSwatch[] = colors.length >= 3
    ? colors.map((color, i) => normalizeColor(color, i))
    : DEFAULT_PALETTE;

  return (
    <div className="text-center space-y-6 py-8">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] bg-stone-100 text-stone-600 border border-stone-200">
          <span className="w-1 h-1 rounded-full bg-stone-400" />
          Attire & Palette
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-2xl md:text-3xl text-stone-900">
        Semi-Formal
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
        We invite our guests to dress in formal or semi-formal attire. Feel free to draw inspiration from our wedding color palette.
      </p>

      {/* Color Swatches */}
      <div className="flex items-center justify-center gap-4 py-4">
        {palette.slice(0, 5).map((swatch, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="w-10 h-10 rounded-full border border-stone-200 shadow-sm transition-transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: swatch.hex }}
              title={swatch.name}
            />
            <span className="text-xs font-serif text-stone-600 tracking-wide capitalize text-center">
              {swatch.name}
            </span>
          </div>
        ))}
      </div>

      {/* Attire Recommendations */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto pt-4">
        <div className="text-left md:text-right space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-900">
            Ladies
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Floor-length dresses, elegant midi dresses, or dressy separates.
          </p>
        </div>
        <div className="text-left space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-900">
            Gentlemen
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Suit and tie, barong tagalog, or tailored blazer with trousers.
          </p>
        </div>
      </div>
    </div>
  );
}
