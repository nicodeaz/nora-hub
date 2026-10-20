// Kit de lanzamiento de norafilmus.com: las piezas de Instagram (generadas en
// el repo norafilmus, `flyers/lanzamiento-web/`) + los textos y la guía para
// publicarlas. Las imágenes viven en public/kit-lanzamiento/ a tamaño real de
// Instagram (1080×1350 feed, 1080×1920 historia) — no se recomprimen acá.

export type KitLang = 'es' | 'en';

export interface KitImage {
  file: string;
  label: string;
}

const BASE = `${import.meta.env.BASE_URL}kit-lanzamiento/`;

export const kitUrl = (file: string) => `${BASE}${file}`;

export const KIT_CAROUSEL: Record<KitLang, KitImage[]> = {
  es: [
    { file: 'carrusel-es-01.jpg', label: '1 · Portada' },
    { file: 'carrusel-es-02.jpg', label: '2 · Crear' },
    { file: 'carrusel-es-03.jpg', label: '3 · Enseñar' },
    { file: 'carrusel-es-04.jpg', label: '4 · Producir' },
    { file: 'carrusel-es-05.jpg', label: '5 · Cierre' },
  ],
  en: [
    { file: 'carrusel-en-01.jpg', label: '1 · Cover' },
    { file: 'carrusel-en-02.jpg', label: '2 · Create' },
    { file: 'carrusel-en-03.jpg', label: '3 · Teach' },
    { file: 'carrusel-en-04.jpg', label: '4 · Produce' },
    { file: 'carrusel-en-05.jpg', label: '5 · Closing' },
  ],
};

export const KIT_STORY: Record<KitLang, KitImage> = {
  es: { file: 'historia-es.jpg', label: 'Historia' },
  en: { file: 'historia-en.jpg', label: 'Story' },
};

export interface KitCaption {
  id: string;
  title: string;
  text: string;
}

export const KIT_CAPTIONS: KitCaption[] = [
  {
    id: 'es',
    title: 'Texto en español',
    text: `Se abre el telón. 🎭

Ya está en línea mi web: norafilmus.com, en español y en inglés.

La armé como un programa de teatro, en tres actos:
I · Crear: arriba del escenario desde 1990.
II · Enseñar: teatro para aprender, crear y vincularse.
III · Producir: producción y coordinación para escena, pantalla y eventos.

Treinta y seis años entre escena, aula y producción, ahora todos en un mismo lugar. Si tenés un proyecto en mente, escribime desde ahí.

Gracias por la magia, @oktoie_ ✨

Link en la bio.

#NoraFilmus #Actriz #Clown #PedagogíaTeatral #ProducciónCultural #TeatroEnEspañol #Dublín #ArgentinosEnIrlanda`,
  },
  {
    id: 'en',
    title: 'Text in English',
    text: `Curtain up. 🎭

My new website is live: norafilmus.com, in English and Spanish.

It reads like a theatre programme, in three acts:
I · Create: on stage since 1990.
II · Teach: theatre to learn, create and connect.
III · Produce: production and coordination for stage, screen and events.

Thirty-six years across performance, teaching and production, all in one place. Got a project in mind? Get in touch through the site.

Thank you for the magic, @oktoie_ ✨

Link in bio.

#NoraFilmus #Actress #Clown #TheatreEducation #CulturalProduction #DublinTheatre #DublinArts`,
  },
  {
    id: 'bilingue',
    title: 'Texto bilingüe (corto)',
    text: `Se abre el telón · Curtain up 🎭

Ya está en línea mi web, en español y en inglés.
My new website is live, in English and Spanish.

👉 norafilmus.com

Crear · Enseñar · Producir
Create · Teach · Produce

Gracias por la magia · Thank you for the magic, @oktoie_ ✨`,
  },
];

export interface KitStep {
  title: string;
  detail?: string;
}

export const KIT_POST_STEPS: KitStep[] = [
  {
    title: 'Guardá las 5 imágenes del carrusel en tu celular',
    detail: 'Tocá "Guardar las 5". En iPhone elegí "Guardar 5 imágenes" para que vayan a Fotos.',
  },
  {
    title: 'En Instagram, tocá el + y elegí "Publicación"',
  },
  {
    title: 'Antes de elegir, tocá las dos flechitas sobre la vista previa',
    detail: 'Así la imagen se ve entera y vertical. Si queda cuadrada, Instagram corta los textos de arriba y de abajo.',
  },
  {
    title: 'Tocá "Seleccionar varias" y elegí las 5 en orden: 1, 2, 3, 4, 5',
    detail: 'Cada placa tiene su número arriba a la derecha (01/05, 02/05…). La portada tiene que ser la primera.',
  },
  {
    title: 'Sin filtros. Tocá Siguiente',
  },
  {
    title: 'Pegá el texto',
    detail: 'Copialo desde acá abajo con el botón "Copiar" y pegalo donde dice "Escribe un pie de foto".',
  },
  {
    title: 'Opcional: "Etiquetar personas" → @oktoie_',
  },
  {
    title: 'Compartir. Y después, fijalo arriba de todo',
    detail: 'En el post: tres puntitos (…) → "Fijar en tu perfil". Así es lo primero que ve quien entra a tu Instagram.',
  },
];

export const KIT_STORY_STEPS: KitStep[] = [
  {
    title: 'Guardá la imagen de la historia',
  },
  {
    title: 'En Instagram, tocá el + y elegí "Historia". Elegí la imagen',
  },
  {
    title: 'Tocá el ícono de stickers (la carita cuadrada) → "Enlace"',
    detail: 'Escribí norafilmus.com. Donde dice "Personalizar texto del sticker" podés poner "Ver la web".',
  },
  {
    title: 'Poné el sticker en el espacio negro de abajo',
    detail: 'Debajo de donde dice norafilmus.com, para que no tape la foto ni el título.',
  },
  {
    title: 'Opcional: sticker "Mención" → @oktoie_',
  },
  {
    title: 'Compartir. Después guardala en Destacadas',
    detail: 'Así el link queda siempre visible en tu perfil, no solo 24 horas.',
  },
];

export const KIT_TIPS: string[] = [
  'En los posts de Instagram los links no se pueden tocar: el link de la historia y el de tu bio son los que llevan a la web. Revisá que tu bio diga norafilmus.com.',
  'Orden sugerido: primero el carrusel y, el mismo día, la historia con el link apuntando a la web.',
  'Español o inglés: subí el carrusel en español y la historia en inglés al día siguiente, para tu público de Irlanda. O usá el texto bilingüe si preferís un solo post.',
  'Las imágenes ya tienen el tamaño exacto de Instagram. No hace falta recortarlas ni editarlas.',
];
