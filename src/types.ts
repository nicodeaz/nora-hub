export type CardCategory = 'principal' | 'gestion' | 'prensa' | 'comunidad' | 'recursos' | 'custom';

export interface HubCardItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name string
  url: string;
  category: CardCategory;
  accentColor: 'red' | 'pink' | 'teal' | 'gold' | 'ink';
  isPinned?: boolean;
  isCustom?: boolean;
  actionType?: 'link' | 'press-kit' | 'testimonials' | 'notes';
  badgeText?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string; // e.g. "Alumna de Taller", "Director Teatral", "Colega Clown"
  message: string;
  date: string;
  isFeatured?: boolean;
  isApproved?: boolean; // Default false for new user-submitted testimonials
}

export interface QuickNoteItem {
  id: string;
  title: string;
  content: string;
  category: 'idea' | 'clown' | 'docencia' | 'produccion' | 'recordatorio';
  createdAt: string;
  updatedAt: string;
  colorTag?: 'pink' | 'teal' | 'gold' | 'red';
}

export interface PressBio {
  type: 'short' | 'medium' | 'long';
  language: 'es' | 'en';
  title: string;
  text: string;
}

export interface AppConfig {
  pin: string;
  cards: HubCardItem[];
  siteUrl: string;
  driveUrl: string;
  calendarUrl: string;
  email: string;
  instagramUrl: string;
  pressDossierUrl: string;
}
