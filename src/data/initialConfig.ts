import { AppConfig, HubCardItem, TestimonialItem, QuickNoteItem, PressBio } from '../types';

export const INITIAL_CARDS: HubCardItem[] = [
  {
    id: 'web-oficial',
    title: 'Sitio Web Oficial',
    description: 'Navega la web personal, portafolio e información pública.',
    icon: 'Globe',
    url: 'https://norafilmus.com',
    category: 'principal',
    accentColor: 'red',
    isPinned: true,
    actionType: 'link',
    badgeText: 'Oficial'
  },
  {
    id: 'google-drive',
    title: 'Google Drive',
    description: 'Carpeta principal con contratos, imágenes, dossiers y documentos de producción.',
    icon: 'FolderKanban',
    url: 'https://drive.google.com/drive/u/0/my-drive',
    category: 'gestion',
    accentColor: 'gold',
    isPinned: true,
    actionType: 'link',
    badgeText: 'Archivos'
  },
  {
    id: 'testimonios',
    title: 'Testimonios & Reseñas',
    description: 'Formulario y muro interactivo de alumnos, colegas y directores.',
    icon: 'Heart',
    url: '#testimonios',
    category: 'comunidad',
    accentColor: 'pink',
    isPinned: true,
    actionType: 'testimonials',
    badgeText: 'Feedback'
  },
  {
    id: 'agenda-calendar',
    title: 'Agenda & Calendario',
    description: 'Acceso directo a funciones, talleres, ensayos y reuniones en Dublin y gira.',
    icon: 'Calendar',
    url: 'https://calendar.google.com',
    category: 'principal',
    accentColor: 'teal',
    isPinned: true,
    actionType: 'link',
    badgeText: 'Fechas'
  },
  {
    id: 'email-correo',
    title: 'Correo Principal',
    description: 'Acceso directo a norafilmus@gmail.com para consultas de producción y docencia.',
    icon: 'Mail',
    url: 'mailto:norafilmus@gmail.com',
    category: 'gestion',
    accentColor: 'ink',
    actionType: 'link',
    badgeText: 'Inbox'
  },
  {
    id: 'redes-sociales',
    title: 'Redes Sociales',
    description: 'Instagram @norafilmus, Facebook, LinkedIn y canal visual.',
    icon: 'Instagram',
    url: 'https://instagram.com/norafilmus',
    category: 'comunidad',
    accentColor: 'pink',
    actionType: 'link',
    badgeText: '@norafilmus'
  },
  {
    id: 'material-prensa',
    title: 'Material de Prensa',
    description: 'Dossier descargable, fotos HD oficiales, biografía y ficha técnica.',
    icon: 'Newspaper',
    url: '#prensa',
    category: 'prensa',
    accentColor: 'red',
    actionType: 'press-kit',
    badgeText: 'Press Kit'
  },
  {
    id: 'recursos-frecuentes',
    title: 'Recursos Frecuentes',
    description: 'Plantillas de presupuesto, guiones de clown, ejercicios teatrales y modelos.',
    icon: 'FileText',
    url: 'https://drive.google.com',
    category: 'recursos',
    accentColor: 'gold',
    actionType: 'link',
    badgeText: 'Plantillas'
  },
  {
    id: 'proximos-proyectos',
    title: 'Próximos Proyectos',
    description: 'Espacio de trabajo para obras en desarrollo, laboratorios creativos y giras.',
    icon: 'Sparkles',
    url: '#proyectos',
    category: 'principal',
    accentColor: 'teal',
    actionType: 'notes',
    badgeText: 'En Desarrollo'
  }
];

export const INITIAL_CONFIG: AppConfig = {
  pin: '1234',
  cards: INITIAL_CARDS,
  siteUrl: 'https://norafilmus.com',
  driveUrl: 'https://drive.google.com',
  calendarUrl: 'https://calendar.google.com',
  email: 'norafilmus@gmail.com',
  instagramUrl: 'https://instagram.com/norafilmus',
  pressDossierUrl: 'https://norafilmus.com/dossier-2026.pdf'
};

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Sofía Martí',
    role: 'Alumna del Taller de Clown y Juego',
    message: 'Tomar clases con Nora cambió mi perspectiva sobre el error en el escenario. Transmite una calidez única y un respeto absoluto por la fragilidad creativa.',
    date: '14 de Junio, 2026',
    isFeatured: true,
    isApproved: true
  },
  {
    id: 't2',
    name: 'Liam O’Connor',
    role: 'Director Cultural · Dublin Festival',
    message: 'Nora brings an extraordinary blend of Latin warmth and sharp theatrical rigor. Her physical comedy and teaching connect deeply with diverse audiences.',
    date: '02 de Mayo, 2026',
    isFeatured: true,
    isApproved: true
  },
  {
    id: 't3',
    name: 'Mateo Rossi',
    role: 'Colega y Productor Teatral',
    message: 'Trabajar con Nora en producción es sinónimo de cuidado, humanidad y máxima profesionalidad. Su capacidad organizativa es pura inspiración.',
    date: '18 de Marzo, 2026',
    isFeatured: true,
    isApproved: true
  }
];

export const INITIAL_NOTES: QuickNoteItem[] = [
  {
    id: 'n1',
    title: 'Idea Taller: El impulso orgánico y la mirada',
    content: 'Ejercicio de laboratorio: Trabajar la pausa limpia antes de la primera palabra. Usar el objeto cotidiano como detonante poético. Acuarela de miradas.',
    category: 'clown',
    createdAt: '2026-07-20T10:30:00Z',
    updatedAt: '2026-07-20T10:30:00Z',
    colorTag: 'pink'
  },
  {
    id: 'n2',
    title: 'Notas de Producción: Gira Dublín - Buenos Aires',
    content: 'Confirmar fechas de ensayo para septiembre. Revisar ficha técnica de iluminación y requerimientos de transporte de vestuario.',
    category: 'produccion',
    createdAt: '2026-07-22T15:00:00Z',
    updatedAt: '2026-07-22T15:00:00Z',
    colorTag: 'teal'
  }
];

export const PRESS_BIOS: PressBio[] = [
  {
    type: 'short',
    language: 'es',
    title: 'Biografía Corta (1 Párrafo)',
    text: 'Nora Filmus es actriz, clown, docente de teatro y productora cultural argentina radicada en Dublín. Su trabajo conecta el arte, la educación y la comunidad a través de una propuesta escénica cálida, poética y profundamente humana.'
  },
  {
    type: 'medium',
    language: 'es',
    title: 'Biografía Mediana (2 Párrafos)',
    text: 'Nora Filmus es actriz, clown, docente de teatro y productora cultural argentina radicada en Dublín. Formada en artes escénicas y pedagogía teatral, ha desarrollado su trayectoria conectando tres mundos que suelen habitar separados: la creación artística, la formación pedagógica y el desarrollo comunitario.\n\nComo artista y docente, invita a explorar la curiosidad, el juego y la fragilidad del clown con profesionalismo y empatía. En su rol de productora impulsa proyectos teatrales e intercambios culturales entre Argentina, Irlanda y Europa.'
  },
  {
    type: 'short',
    language: 'en',
    title: 'Short Bio (1 Paragraph)',
    text: 'Nora Filmus is an Argentine actress, clown, drama teacher, and cultural producer based in Dublin. Her work bridges performing arts, education, and community through an inviting, poetic, and deeply human theatrical approach.'
  },
  {
    type: 'medium',
    language: 'en',
    title: 'Medium Bio (2 Paragraphs)',
    text: 'Nora Filmus is an Argentine actress, clown, theatre pedagogue, and cultural producer based in Dublin. With extensive background in physical theatre and clowning, she bridges creative performance, arts education, and community engagement.\n\nHer workshops and artistic projects celebrate curiosity, vulnerability, and play. As a cultural producer, she actively facilitates cross-cultural collaborations between South America and Ireland.'
  }
];
