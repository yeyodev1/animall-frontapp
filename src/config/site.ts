/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 */

const CLOUD = 'https://res.cloudinary.com/plsbvc7l/image/upload'

/**
 * URL de Cloudinary con transformaciones. `path` va sin extensión de formato
 * forzada: f_auto entrega AVIF/WebP según el navegador.
 */
export function cld(path: string, transforms = 'f_auto,q_auto'): string {
  return `${CLOUD}/${transforms}/${path}`
}

/** Ilustraciones generadas para la web (Higgsfield), fondo transparente. */
export const art = {
  heroDog: 'animall/web/hero-dog.png',
  heroCat: 'animall/web/hero-cat.png',
  dogSleeping: 'animall/web/dog-sleeping.png',
  dogTail: 'animall/web/dog-tail.png',
  stepCatalogo: 'animall/web/step-1-catalogo.png',
  stepPedido: 'animall/web/step-2-pedido.png',
  stepWhatsapp: 'animall/web/step-3-whatsapp.png',
  stepRetira: 'animall/web/step-4-retira.png',
  serviceAlimento: 'animall/web/service-alimento.png',
  serviceFarmacia: 'animall/web/service-farmacia.png',
  serviceGrooming: 'animall/web/service-grooming.png',
  serviceAccesorios: 'animall/web/service-accesorios.png',
} as const

/** Fotos reales del local y piezas de marca. */
export const photos = {
  logo: 'animall/catalogos-2026/logo.png',
  logoIcon: 'animall/catalogos-2026/logo-icono.jpg',
  entrada: 'animall/catalogos-2026/tienda-entrada.jpg',
  estanterias: 'animall/catalogos-2026/tienda-estanterias.jpg',
  neon: 'animall/catalogos-2026/tienda-neon.jpg',
  grooming: 'animall/catalogos-2026/tienda-grooming.jpg',
  portadaGeneral: 'animall/catalogos-2026/portada-general.png',
  portadaSuperPremium: 'animall/catalogos-2026/portada-super-premium.png',
} as const

export const contacts = [
  {
    key: 'fiorella',
    label: 'Pedidos y asesoría',
    name: 'Fiorella',
    phone: '098 470 4417',
    whatsapp: '593984704417',
  },
  {
    key: 'americas',
    label: 'Visítanos',
    name: 'Plaza Las Américas',
    phone: '099 906 3810',
    whatsapp: '593999063810',
  },
] as const

export type ContactKey = (typeof contacts)[number]['key']

export const site = {
  name: 'Animall',
  tagline: 'Te ayudamos a consentir a tu mascota',
  description:
    'Tienda de mascotas en Plaza Las Américas. Alimento, snacks, farmacia, accesorios y grooming. Todos los productos con descuento.',
  url: 'https://animall.vercel.app',
  // Número principal para el botón flotante y los CTA genéricos
  whatsapp: '593984704417',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Catálogo', to: '/catalogo' },
    { label: 'Servicios', to: '/#servicios' },
    { label: 'Cómo pedir', to: '/#como-pedir' },
    { label: 'Visítanos', to: '/#visitanos' },
  ],

  gate: {
    title: ['Lanza la', 'pelota para', 'entrar'],
    hint: 'Llegaste a una tienda de mascotas. Haz rebotar la pelota y pasa.',
    skip: 'Entrar sin jugar',
  },

  hero: {
    eyebrow: 'Tienda de mascotas · Plaza Las Américas',
    titleLeft: ['Un perro', 'consentido'],
    titleRight: ['es un perro', 'feliz!'],
    lead: 'En Animall sabemos que tu mascota es parte de la familia. Por eso tenemos todo lo que necesita, y todo con descuento.',
    cta: 'Ver catálogo',
    ctaSecondary: 'Pedir por WhatsApp',
  },

  intro: {
    text: 'Alimento estándar, premium y super premium, snacks, farmacia, ropa, juguetes y accesorios. Y si no lo tenemos, nos encargamos de encontrarlo.',
    link: 'Conócenos',
  },

  marquee: ['Todo con descuento', 'Super premium', 'Snacks', 'Farmacia', 'Grooming', 'Accesorios', 'Ropa', 'Juguetes'],

  services: {
    eyebrow: 'Lo que hacemos',
    cta: 'Consultar',
    // {servicio} se reemplaza por el nombre del servicio en minúsculas
    ctaMessage: 'Hola Animall, quiero información sobre {servicio}',
    title: 'Nuestros servicios',
    items: [
      {
        key: 'alimento',
        number: '01',
        title: 'Alimento',
        text: 'Estándar, premium y super premium para perros y gatos, de las marcas que tu mascota ya conoce.',
        art: art.serviceAlimento,
      },
      {
        key: 'farmacia',
        number: '02',
        title: 'Farmacia',
        text: 'Desparasitantes, vitaminas y cuidado veterinario para que esté siempre sano.',
        art: art.serviceFarmacia,
      },
      {
        key: 'grooming',
        number: '03',
        title: 'Grooming',
        text: 'Baño y peluquería en nuestro local, con tina y mesa de grooming profesional.',
        art: art.serviceGrooming,
      },
      {
        key: 'accesorios',
        number: '04',
        title: 'Accesorios',
        text: 'Ropa, juguetes, camas, collares y todo lo que lo hace feliz.',
        art: art.serviceAccesorios,
      },
    ],
  },

  steps: {
    eyebrow: 'Proceso',
    title: '¿Cómo pedir?',
    lead: 'Arma tu pedido en la web y te lo confirmamos por WhatsApp.',
    items: [
      {
        number: '01.',
        title: 'Explora el catálogo',
        text: 'Más de 400 productos con su precio Animall, ya con descuento.',
        art: art.stepCatalogo,
      },
      {
        number: '02.',
        title: 'Arma tu pedido',
        text: 'Elige la presentación y la cantidad, y agrégalas al carrito.',
        art: art.stepPedido,
      },
      {
        number: '03.',
        title: 'Envíalo por WhatsApp',
        text: 'Tu pedido llega armado a nuestro chat con su código y el total.',
        art: art.stepWhatsapp,
      },
      {
        number: '04.',
        title: 'Retira o recibe',
        text: 'Te confirmamos disponibilidad y coordinamos la entrega o el retiro en el local.',
        art: art.stepRetira,
      },
    ],
  },

  featured: {
    eyebrow: 'Destacados',
    title: 'Los favoritos',
    cta: 'Ver todo el catálogo',
  },

  catalogs: {
    eyebrow: 'Catálogos 2026',
    title: 'Míralos en línea',
    items: [
      {
        key: 'general',
        title: 'Nutrición y cuidado animal',
        meta: '116 páginas',
        cover: photos.portadaGeneral,
        file: '/catalogos/animall-2026-nutricion-y-cuidado-animal.pdf',
      },
      {
        key: 'super-premium',
        title: 'Alimento seco super premium',
        meta: '35 páginas',
        cover: photos.portadaSuperPremium,
        file: '/catalogos/animall-2026-alimento-super-premium.pdf',
      },
    ],
    view: 'Ver catálogo',
  },

  bigline: {
    eyebrow: 'El cuidado personalizado que tu mascota merece',
    title: ['El cuidado que', 'tu mascota', 'merece!'],
  },

  visit: {
    eyebrow: 'Visítanos',
    title: 'Plaza Las Américas',
    text: 'Pasa por el local: estanterías llenas, área de grooming y alguien que te ayuda a elegir.',
    handle: 'aniMALL',
    photos: {
      entrada: 'Entrada del local de Animall en Plaza Las Américas',
      estanterias: 'Estanterías llenas de alimento y accesorios en Animall',
      neon: 'Letrero de neón verde de Animall dentro del local',
      grooming: 'Área de grooming con tina y mesa profesional',
    },
  },

  notFound: {
    title: 'Esta página no existe',
    text: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
    cta: 'Volver al inicio',
  },

  contact: {
    eyebrow: 'Escríbenos',
    title: ['¿Tienes', 'preguntas?'],
    lead: 'Respondemos por WhatsApp.',
  },

  promise: 'Todos los productos cuentan con descuento',

  footer: {
    tagline: 'Te ayudamos a consentir a tu mascota',
    menuTitle: 'Menú',
    admin: 'Panel admin',
    rights: 'Animall. Todos los derechos reservados.',
    madeBy: 'Hecho por',
    madeByName: 'Bakano',
    madeByUrl: 'https://bakano.ec',
  },

  catalog: {
    title: 'Catálogo',
    lead: 'Precios Animall, ya con descuento. Elige, agrega al carrito y envía tu pedido por WhatsApp.',
    searchPlaceholder: 'Busca por producto, marca o categoría',
    empty: 'No encontramos productos con esos filtros.',
    emptyCta: 'Limpiar filtros',
    sorts: [
      { value: 'relevancia', label: 'Destacados' },
      { value: 'precio-asc', label: 'Menor precio' },
      { value: 'precio-desc', label: 'Mayor precio' },
      { value: 'ahorro', label: 'Mayor ahorro' },
      { value: 'nombre', label: 'Nombre A-Z' },
    ],
    // pvp = precio impreso en la funda (va tachado); pvc = precio que ofrece Animall.
    // Nunca mostrar "PVC" al cliente.
    priceLabel: 'Precio Animall',
    pvpLabel: 'Precio en funda',
    addToCart: 'Agregar',
    added: 'Agregado al carrito',
  },

  cart: {
    title: 'Tu pedido',
    empty: 'Tu carrito está vacío.',
    emptyCta: 'Ir al catálogo',
    savings: 'Ahorras',
    total: 'Total Animall',
    checkout: 'Enviar pedido por WhatsApp',
    formTitle: 'Tus datos',
    nameLabel: 'Nombre',
    phoneLabel: 'Teléfono',
    noteLabel: 'Nota (opcional)',
    notePlaceholder: 'Ej. retiro en el local el sábado',
    storeLabel: '¿A quién le escribes?',
    send: 'Enviar por WhatsApp',
    sent: 'Abrimos WhatsApp con tu pedido. Si no se abrió, toca el botón de nuevo.',
    disclaimer: 'Te confirmamos disponibilidad y entrega por WhatsApp. Los precios pueden variar sin previo aviso.',
  },

  labels: {
    species: {
      perro: 'Perros',
      gato: 'Gatos',
      ave: 'Aves',
      pez: 'Peces',
      roedor: 'Roedores',
      granja: 'Granja',
      general: 'General',
    } as Record<string, string>,
    types: {
      'alimento-seco': 'Alimento seco',
      'alimento-humedo': 'Alimento húmedo',
      snack: 'Snacks',
      farmacia: 'Farmacia',
      higiene: 'Higiene',
      accesorio: 'Accesorios',
      otro: 'Otros',
    } as Record<string, string>,
    orderStatus: {
      nueva: 'Nueva',
      confirmada: 'Confirmada',
      entregada: 'Entregada',
      cancelada: 'Cancelada',
    } as Record<string, string>,
  },
} as const

export function whatsappLink(message = 'Hola Animall, quiero más información', number: string = site.whatsapp): string {
  if (!number) return '#'
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** Textos de la interfaz del catálogo y filtros. */
export const catalogCopy = {
  filters: 'Filtros',
  clear: 'Limpiar',
  allSpecies: 'Todos',
  species: 'Mascota',
  type: 'Tipo',
  category: 'Categoría',
  brand: 'Marca',
  brandSearch: 'Buscar marca',
  showMore: 'Ver más',
  showLess: 'Ver menos',
  sort: 'Ordenar',
  resultsWord: (n: number) => (n === 1 ? 'producto' : 'productos'),
  results: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  showResults: (n: number) => (n === 1 ? 'Ver 1 producto' : `Ver ${n} productos`),
  showing: (shown: number, total: number) => `Mostrando ${shown} de ${total}`,
  loadMore: 'Cargar más',
  from: 'desde',
  added: 'Agregado',
  searchLabel: 'Buscar en el catálogo',
  clearSearch: 'Borrar búsqueda',
  emptyTitle: 'Nada por aquí',
  emptyHint: 'Prueba con otra palabra o quita algún filtro.',
  errorTitle: 'No pudimos cargar el catálogo',
  retry: 'Reintentar',
  superPremium: 'Super premium',
  saving: 'Ahorras',
  viewProduct: (name: string) => `Ver ${name}`,
  sizeLabel: (name: string) => `Presentación de ${name}`,
} as const

/** Textos de la ficha de producto. */
export const productCopy = {
  home: 'Inicio',
  catalog: 'Catálogo',
  breadcrumb: 'Ruta de navegación',
  variants: 'Elige la presentación',
  sizeCol: 'Presentación',
  qty: 'Cantidad',
  addToCart: 'Agregar al carrito',
  orderWhatsapp: 'Pedir este producto por WhatsApp',
  related: 'También le puede gustar',
  prev: 'Anterior',
  next: 'Siguiente',
  notFoundTitle: 'Este producto se escapó',
  notFoundText: 'No lo encontramos. Puede que ya no esté en el catálogo o que el enlace tenga un error.',
  notFoundCta: 'Volver al catálogo',
  perks: ['Precio Animall ya con descuento', 'Pedido confirmado por WhatsApp', 'Retiro en Plaza Las Américas'],
  decrease: 'Quitar uno',
  increase: 'Agregar uno',
} as const

/** Textos del carrito y el envío del pedido. */
export const cartCopy = {
  close: 'Cerrar carrito',
  back: 'Volver al carrito',
  stepCart: 'Carrito',
  stepForm: 'Tus datos',
  remove: (name: string) => `Quitar ${name} del carrito`,
  decrease: (name: string) => `Quitar uno de ${name}`,
  increase: (name: string) => `Agregar uno de ${name}`,
  qtyOf: (name: string) => `Cantidad de ${name}`,
  items: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  namePlaceholder: 'Cómo te llamas',
  phonePlaceholder: '09X XXX XXXX',
  nameError: 'Escribe tu nombre',
  phoneError: 'Escribe un teléfono válido',
  storeError: 'Elige a quién le escribes',
  sending: 'Enviando…',
  successTitle: 'Pedido listo',
  codeLabel: 'Código de tu pedido',
  openWhatsapp: 'Abrir WhatsApp',
  blocked: 'Tu navegador bloqueó la ventana. Toca el botón para abrir WhatsApp.',
  keepShopping: 'Seguir comprando',
} as const
