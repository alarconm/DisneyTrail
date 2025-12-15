import { useGameStore } from '../../stores/gameStore';

interface TabbyCatProps {
  variant: 'marge' | 'minestrone' | 'mac';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  mood?: 'happy' | 'sad' | 'sleeping' | 'excited' | 'sick';
  className?: string;
}

// Color palettes for each cat - gray tabbies based on the real cats!
const CAT_COLORS = {
  marge: {
    primary: '#6B6B6B', // Gray
    secondary: '#8A8A8A', // Lighter gray
    stripes: '#3D3D3D', // Dark gray stripes
    belly: '#FFFFFF', // White chest patch
    nose: '#FFB6C1', // Pink nose
    eyes: '#9ACD32', // Yellow-green eyes
  },
  minestrone: {
    primary: '#5A5A5A', // Slightly darker gray
    secondary: '#7A7A7A', // Medium gray
    stripes: '#2D2D2D', // Dark stripes
    belly: '#FFFFFF', // White chest
    nose: '#FFB6C1', // Pink nose
    eyes: '#9ACD32', // Yellow-green eyes
  },
  mac: {
    primary: '#787878', // Gray (slightly lighter)
    secondary: '#959595', // Light gray
    stripes: '#454545', // Dark gray stripes
    belly: '#FFFFFF', // White chest
    nose: '#FFB6C1', // Pink nose
    eyes: '#9ACD32', // Yellow-green eyes
  },
};

const SIZES = {
  sm: { width: 32, height: 32, scale: 'scale-100' },
  md: { width: 48, height: 48, scale: 'scale-100' },
  lg: { width: 64, height: 64, scale: 'scale-100' },
  xl: { width: 96, height: 96, scale: 'scale-100' },
};

export default function TabbyCat({
  variant,
  size = 'md',
  animated = true,
  mood = 'happy',
  className = '',
}: TabbyCatProps) {
  const { googlyEyesMode } = useGameStore();
  const colors = CAT_COLORS[variant];
  const dimensions = SIZES[size];

  const getMoodAnimation = () => {
    switch (mood) {
      case 'excited':
        return 'animate-bounce';
      case 'sleeping':
        return '';
      case 'sick':
        return 'opacity-70';
      case 'sad':
        return '';
      default:
        return animated ? 'hover:scale-110 transition-transform' : '';
    }
  };

  const getEyeExpression = () => {
    if (googlyEyesMode) {
      return (
        <>
          {/* Googly eyes! */}
          <circle cx="35" cy="35" r="12" fill="white" stroke="#333" strokeWidth="1" />
          <circle cx="65" cy="35" r="12" fill="white" stroke="#333" strokeWidth="1" />
          <circle cx="38" cy="37" r="6" fill="#111" className="animate-pulse">
            <animate attributeName="cx" values="38;32;38;42;38" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="68" cy="37" r="6" fill="#111" className="animate-pulse">
            <animate attributeName="cx" values="68;62;68;72;68" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      );
    }

    switch (mood) {
      case 'sleeping':
        return (
          <>
            <path d="M28 38 Q35 35 42 38" stroke="#333" strokeWidth="2" fill="none" />
            <path d="M58 38 Q65 35 72 38" stroke="#333" strokeWidth="2" fill="none" />
            <text x="75" y="25" fontSize="10" fill="#333">z</text>
            <text x="82" y="18" fontSize="8" fill="#333">z</text>
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="35" cy="38" r="6" fill={colors.eyes} />
            <circle cx="65" cy="38" r="6" fill={colors.eyes} />
            <circle cx="35" cy="38" r="3" fill="#111" />
            <circle cx="65" cy="38" r="3" fill="#111" />
            <path d="M28 32 L42 36" stroke="#333" strokeWidth="1.5" />
            <path d="M72 36 L58 32" stroke="#333" strokeWidth="1.5" />
            {/* Tear */}
            <ellipse cx="42" cy="48" rx="2" ry="3" fill="#87CEEB" opacity="0.8" />
          </>
        );
      case 'excited':
        return (
          <>
            <circle cx="35" cy="36" r="8" fill={colors.eyes} />
            <circle cx="65" cy="36" r="8" fill={colors.eyes} />
            <circle cx="35" cy="36" r="5" fill="#111" />
            <circle cx="65" cy="36" r="5" fill="#111" />
            <circle cx="37" cy="34" r="2" fill="white" />
            <circle cx="67" cy="34" r="2" fill="white" />
            {/* Sparkles */}
            <text x="18" y="28" fontSize="8">✨</text>
            <text x="75" y="28" fontSize="8">✨</text>
          </>
        );
      case 'sick':
        return (
          <>
            <circle cx="35" cy="38" r="5" fill={colors.eyes} opacity="0.7" />
            <circle cx="65" cy="38" r="5" fill={colors.eyes} opacity="0.7" />
            <circle cx="35" cy="38" r="2" fill="#111" />
            <circle cx="65" cy="38" r="2" fill="#111" />
            <path d="M30 30 L25 25" stroke="#333" strokeWidth="1" />
            <path d="M70 30 L75 25" stroke="#333" strokeWidth="1" />
          </>
        );
      default: // happy
        return (
          <>
            <circle cx="35" cy="36" r="7" fill={colors.eyes} />
            <circle cx="65" cy="36" r="7" fill={colors.eyes} />
            <circle cx="36" cy="36" r="4" fill="#111" />
            <circle cx="66" cy="36" r="4" fill="#111" />
            <circle cx="38" cy="34" r="1.5" fill="white" />
            <circle cx="68" cy="34" r="1.5" fill="white" />
          </>
        );
    }
  };

  return (
    <div
      className={`inline-block ${getMoodAnimation()} ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className="drop-shadow-md"
      >
        {/* Ears */}
        <polygon
          points="15,35 25,5 40,30"
          fill={colors.primary}
          stroke={colors.stripes}
          strokeWidth="1"
        />
        <polygon
          points="85,35 75,5 60,30"
          fill={colors.primary}
          stroke={colors.stripes}
          strokeWidth="1"
        />
        {/* Inner ears */}
        <polygon points="20,32 27,12 37,28" fill={colors.nose} opacity="0.5" />
        <polygon points="80,32 73,12 63,28" fill={colors.nose} opacity="0.5" />

        {/* Head */}
        <ellipse cx="50" cy="50" rx="40" ry="35" fill={colors.primary} />

        {/* Tabby stripes on forehead */}
        <path d="M35 25 Q50 15 65 25" stroke={colors.stripes} strokeWidth="3" fill="none" />
        <path d="M40 32 Q50 25 60 32" stroke={colors.stripes} strokeWidth="2" fill="none" />
        <path d="M50 15 L50 28" stroke={colors.stripes} strokeWidth="2" />

        {/* Face patch */}
        <ellipse cx="50" cy="55" rx="25" ry="22" fill={colors.secondary} />

        {/* Cheeks */}
        <ellipse cx="25" cy="55" rx="10" ry="8" fill={colors.belly} opacity="0.6" />
        <ellipse cx="75" cy="55" rx="10" ry="8" fill={colors.belly} opacity="0.6" />

        {/* Eyes */}
        {getEyeExpression()}

        {/* Nose */}
        <ellipse cx="50" cy="52" rx="5" ry="4" fill={colors.nose} />

        {/* Mouth */}
        {mood === 'happy' || mood === 'excited' ? (
          <>
            <path d="M50 56 Q45 62 40 58" stroke="#333" strokeWidth="1.5" fill="none" />
            <path d="M50 56 Q55 62 60 58" stroke="#333" strokeWidth="1.5" fill="none" />
          </>
        ) : mood === 'sad' ? (
          <path d="M42 62 Q50 58 58 62" stroke="#333" strokeWidth="1.5" fill="none" />
        ) : (
          <path d="M42 60 L58 60" stroke="#333" strokeWidth="1.5" />
        )}

        {/* Whiskers */}
        <line x1="20" y1="50" x2="5" y2="48" stroke="#333" strokeWidth="1" />
        <line x1="20" y1="55" x2="5" y2="55" stroke="#333" strokeWidth="1" />
        <line x1="20" y1="60" x2="5" y2="62" stroke="#333" strokeWidth="1" />
        <line x1="80" y1="50" x2="95" y2="48" stroke="#333" strokeWidth="1" />
        <line x1="80" y1="55" x2="95" y2="55" stroke="#333" strokeWidth="1" />
        <line x1="80" y1="60" x2="95" y2="62" stroke="#333" strokeWidth="1" />

        {/* Tail animation hint */}
        {animated && mood !== 'sleeping' && (
          <ellipse cx="90" cy="85" rx="8" ry="4" fill={colors.primary}>
            <animate
              attributeName="cx"
              values="90;85;90;95;90"
              dur="1s"
              repeatCount="indefinite"
            />
          </ellipse>
        )}
      </svg>
    </div>
  );
}

// Helper component for displaying all three cats together
export function CatFamily({
  size = 'md',
  animated = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <div className="text-center">
        <TabbyCat variant="marge" size={size} animated={animated} />
        <p className="text-xs text-white/70 mt-1">Marge</p>
      </div>
      <div className="text-center">
        <TabbyCat variant="minestrone" size={size} animated={animated} mood="excited" />
        <p className="text-xs text-white/70 mt-1">Minestrone</p>
      </div>
      <div className="text-center">
        <TabbyCat variant="mac" size={size} animated={animated} />
        <p className="text-xs text-white/70 mt-1">Mac</p>
      </div>
    </div>
  );
}
