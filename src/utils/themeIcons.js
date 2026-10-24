import {
  Laptop,
  Shirt,
  Coins,
  Utensils,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Globe2,
  Cpu,
  Building2,
  Leaf,
  Palette,
  Music,
  Gamepad2,
  Plane,
  Dumbbell,
  BookOpen,
  Camera,
  Code,
  Sparkles,
} from 'lucide-react';

// Map an expo's theme string to the most-relevant lucide icon.
// Used in public cards where the original theme showed Unsplash images
// (which were removed per the "no fake data" rule).
const THEME_KEYWORD_MAP = [
  { rx: /\b(ai|artificial|intelligen|tech|software|cloud|cyber|saas|data|robot|iot|hardware|digital|it\b)/i, Icon: Cpu },
  { rx: /\b(fashion|lifestyle|apparel|textile|garment|beauty|cosmetic)/i, Icon: Shirt },
  { rx: /\b(finance|fintech|banking|invest|business|trade|commerce|market|econom)/i, Icon: Coins },
  { rx: /\b(food|beverage|gastronom|hospitality|cuisine|restaurant|catering|drink)/i, Icon: Utensils },
  { rx: /\b(automotive|auto|vehicle|car|motor|mobility|transport)/i, Icon: Car },
  { rx: /\b(real estate|property|construction|building|architect|infrastructur)/i, Icon: Building2 },
  { rx: /\b(health|medic|pharma|biotec|wellness|clinic|hospital)/i, Icon: HeartPulse },
  { rx: /\b(edu|learn|teach|academic|school|universit|course|training)/i, Icon: GraduationCap },
  { rx: /\b(enviro|sustainab|green|climate|ecolog|renewable|energy|carbon)/i, Icon: Leaf },
  { rx: /\b(art|culture|gallery|paint|sculpt|heritage|history|museum)/i, Icon: Palette },
  { rx: /\b(music|sound|concert|audio|festival)/i, Icon: Music },
  { rx: /\b(game|gaming|esport|play|interactive)/i, Icon: Gamepad2 },
  { rx: /\b(travel|tourism|tour|trip|destination|voyage|cruise)/i, Icon: Plane },
  { rx: /\b(fitness|sport|athletic|gym|outdoor|adventure)/i, Icon: Dumbbell },
  { rx: /\b(book|literature|publish|author|writer|library|press)/i, Icon: BookOpen },
  { rx: /\b(photo|film|video|cinema|media|broadcast)/i, Icon: Camera },
  { rx: /\b(code|developer|program|software engineer|web|app)/i, Icon: Code },
  { rx: /\b(propert|home|house|interior|design)/i, Icon: Home },
  { rx: /\b(global|international|world|expo)/i, Icon: Globe2 },
];

/**
 * Returns a lucide icon component appropriate for the given expo theme string.
 * Falls back to a generic `Sparkles` icon when no keyword matches.
 *
 * Usage:
 *   const Icon = getThemeIcon(expo.theme || expo.title);
 *   <Icon className="w-6 h-6" />
 */
export const getThemeIcon = (themeOrTitle = '') => {
  const haystack = String(themeOrTitle);
  for (const entry of THEME_KEYWORD_MAP) {
    if (entry.rx.test(haystack)) return entry.Icon;
  }
  return Sparkles;
};

// Default fallback icons (for places where we just need a generic expo glyph).
export const FALLBACK_ICONS = {
  Laptop,
  Globe2,
  Sparkles,
};

export default getThemeIcon;
