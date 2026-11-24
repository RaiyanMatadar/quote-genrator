export interface TemplateOption {
  id: 'minimalist' | 'corporate' | 'creative' | 'nordic' | 'compact';
  name: string;
  description: string;
  category: string;
}

export const TEMPLATES: TemplateOption[] = [
  {
    id: 'minimalist',
    name: 'Modern Minimalist',
    description: 'Refined Geist aesthetic with hairline borders and crisp typography.',
    category: 'Universal'
  },
  {
    id: 'corporate',
    name: 'Executive Corporate',
    description: 'Solid header banner and structured two-tone financial card layout.',
    category: 'Corporate'
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    description: 'Bold modern dark accents and high-contrast creative styling.',
    category: 'Agencies'
  },
  {
    id: 'nordic',
    name: 'Nordic Clean',
    description: 'Generous whitespace, soft inset grey containers, and pill badges.',
    category: 'Modern'
  },
  {
    id: 'compact',
    name: 'Compact Tech',
    description: 'Dense tabular grid with monospace labels for developers & IT.',
    category: 'Technical'
  }
];

export interface AccentColor {
  id: string;
  name: string;
  hex: string;
  borderClass: string;
  bgClass: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'ink', name: 'Geist Black', hex: '#171717', borderClass: 'border-[#171717]', bgClass: 'bg-[#171717]' },
  { id: 'blue', name: 'Vercel Blue', hex: '#0070f3', borderClass: 'border-[#0070f3]', bgClass: 'bg-[#0070f3]' },
  { id: 'emerald', name: 'Emerald', hex: '#10b981', borderClass: 'border-[#10b981]', bgClass: 'bg-[#10b981]' },
  { id: 'indigo', name: 'Indigo', hex: '#6366f1', borderClass: 'border-[#6366f1]', bgClass: 'bg-[#6366f1]' },
  { id: 'violet', name: 'Violet', hex: '#7928ca', borderClass: 'border-[#7928ca]', bgClass: 'bg-[#7928ca]' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', borderClass: 'border-[#f43f5e]', bgClass: 'bg-[#f43f5e]' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', borderClass: 'border-[#f59e0b]', bgClass: 'bg-[#f59e0b]' }
];
