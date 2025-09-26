import { Project } from '@/types/project';

export const projectsData: Project[] = [
  {
    slug: 'cocinas-modernas',
    title: 'Cocinas Modernas',
    category: 'Cocinas',
    status: 'active',
    seo: {
      title: 'Cocinas Modernas a Medida - Baúl de Moda',
      description: 'Diseñamos y construimos cocinas modernas a medida con maderas de primera calidad. Proyectos únicos y funcionales para tu hogar.',
      keywords: ['cocinas modernas', 'cocinas a medida', 'muebles de cocina', 'carpintería', 'maderas'],
      ogImage: '/images/obra-cocina.jpg',
      canonical: '/proyectos/cocinas-modernas'
    },
    banner: {
      id: 'banner-cocinas',
      autoplayInterval: 6000,
      showControls: true,
      showIndicators: true,
      slides: [
        {
          id: 'slide-1',
          title: 'Cocinas Modernas',
          subtitle: 'Diseño y Funcionalidad',
          description: 'Creamos cocinas únicas que combinan estilo moderno con funcionalidad práctica, utilizando las mejores maderas y acabados.',
          backgroundImage: '/images/obra-cocina.jpg',
          ctaText: 'Ver Nuestros Diseños',
          ctaUrl: '#gallery',
          secondaryCtaText: 'Solicitar Presupuesto',
          secondaryCtaUrl: '#contact',
          overlayOpacity: 0.6
        },
        {
          id: 'slide-2',
          title: 'Cocinas a Medida',
          subtitle: 'Cada Espacio es Único',
          description: 'Diseñamos cada cocina específicamente para tu espacio, optimizando cada centímetro y adaptándonos a tu estilo de vida.',
          backgroundImage: '/images/madera-eucalipto.jpg',
          ctaText: 'Conocer Proceso',
          ctaUrl: '#services',
          secondaryCtaText: 'Ver Galería',
          secondaryCtaUrl: '#gallery',
          overlayOpacity: 0.7
        },
        {
          id: 'slide-3',
          title: 'Calidad Premium',
          subtitle: '150+ Cocinas Realizadas',
          description: 'Con más de 150 cocinas realizadas, somos expertos en transformar espacios con la más alta calidad y atención al detalle.',
          backgroundImage: '/images/madera-saligna.jpg',
          ctaText: 'Ver Testimonios',
          ctaUrl: '#testimonials',
          secondaryCtaText: 'Contactar Ahora',
          secondaryCtaUrl: 'tel:01134976239',
          overlayOpacity: 0.5
        }
      ]
    },
    info: {
      id: 'info-cocinas',
      title: 'Cocinas que Inspiran',
      description: 'Cada cocina es única y está diseñada para adaptarse perfectamente a tu estilo de vida. Utilizamos maderas seleccionadas y técnicas de carpintería tradicional combinadas con diseños contemporáneos.',
      features: [
        {
          id: 'feature-1',
          icon: '🎨',
          title: 'Diseño Personalizado',
          description: 'Cada proyecto es único y diseñado específicamente para tu espacio y necesidades.'
        },
        {
          id: 'feature-2',
          icon: '🔧',
          title: 'Instalación Profesional',
          description: 'Nuestro equipo se encarga de la instalación completa con la máxima precisión.'
        },
        {
          id: 'feature-3',
          icon: '⭐',
          title: 'Materiales Premium',
          description: 'Utilizamos solo maderas de primera calidad y herrajes de marcas reconocidas.'
        }
      ],
      stats: [
        {
          id: 'stat-1',
          number: '150',
          label: 'Cocinas Realizadas',
          suffix: '+'
        },
        {
          id: 'stat-2',
          number: '5',
          label: 'Años de Garantía'
        },
        {
          id: 'stat-3',
          number: '98',
          label: 'Satisfacción Cliente',
          suffix: '%'
        },
        {
          id: 'stat-4',
          number: '30',
          label: 'Días Promedio'
        }
      ]
    },
    services: [
      {
        id: 'service-1',
        title: 'Diseño y Planificación',
        description: 'Creamos el diseño perfecto para tu cocina, optimizando cada centímetro disponible y adaptándonos a tu estilo de vida.',
        image: '/images/obra-cocina.jpg',
        features: [
          'Planos 3D detallados',
          'Optimización del espacio',
          'Selección de materiales',
          'Asesoramiento personalizado'
        ],
        price: {
          from: 150000,
          currency: '$',
          unit: 'm²'
        }
      },
      {
        id: 'service-2',
        title: 'Fabricación a Medida',
        description: 'Fabricamos todos los muebles en nuestro taller con maderas seleccionadas y técnicas artesanales de alta precisión.',
        image: '/images/madera-pino.jpg',
        features: [
          'Maderas de primera calidad',
          'Cortes de precisión milimétrica',
          'Acabados profesionales',
          'Herrajes de marca'
        ]
      },
      {
        id: 'service-3',
        title: 'Instalación Completa',
        description: 'Nuestro equipo especializado se encarga de la instalación completa, incluyendo conexiones eléctricas y de plomería.',
        image: '/images/obra-estanteria.jpg',
        features: [
          'Instalación profesional',
          'Conexiones eléctricas',
          'Ajustes finales',
          'Limpieza post-instalación'
        ]
      }
    ],
    gallery: {
      id: 'gallery-cocinas',
      title: 'Galería de Proyectos',
      description: 'Explora algunos de nuestros proyectos de cocinas más destacados',
      categories: ['Modernas', 'Clásicas', 'Minimalistas', 'Rústicas'],
      items: [
        {
          id: 'img-1',
          title: 'Cocina Moderna Integral',
          description: 'Cocina completa con isla central y acabados en madera de eucalipto',
          image: '/images/obra-cocina.jpg',
          category: 'Modernas'
        },
        {
          id: 'img-2',
          title: 'Cocina Minimalista',
          description: 'Diseño limpio y funcional con maderas claras',
          image: '/images/madera-pino.jpg',
          category: 'Minimalistas'
        },
        {
          id: 'img-3',
          title: 'Cocina Clásica',
          description: 'Estilo tradicional con detalles artesanales',
          image: '/images/madera-eucalipto.jpg',
          category: 'Clásicas'
        },
        {
          id: 'img-4',
          title: 'Cocina Rústica',
          description: 'Ambiente cálido con maderas naturales',
          image: '/images/madera-quebracho.jpg',
          category: 'Rústicas'
        }
      ]
    },
    testimonials: [
      {
        id: 'testimonial-1',
        name: 'María González',
        role: 'Propietaria',
        content: 'Quedé fascinada con mi nueva cocina. El equipo de Baúl de Moda superó todas mis expectativas. La calidad de los materiales y la atención al detalle son excepcionales.',
        rating: 5,
        avatar: '/placeholder.png'
      },
      {
        id: 'testimonial-2',
        name: 'Carlos Ruiz',
        role: 'Arquitecto',
        company: 'Estudio Ruiz',
        content: 'Trabajamos frecuentemente con Baúl de Moda para nuestros proyectos. Su profesionalismo y calidad de trabajo los convierte en nuestro socio ideal.',
        rating: 5,
        avatar: '/placeholder.png'
      },
      {
        id: 'testimonial-3',
        name: 'Ana Martínez',
        role: 'Diseñadora de Interiores',
        content: 'La transformación de mi cocina fue increíble. Desde el diseño hasta la instalación, todo fue perfecto. Recomiendo ampliamente sus servicios.',
        rating: 5,
        avatar: '/placeholder.png'
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question: '¿Cuánto tiempo toma realizar una cocina completa?',
        answer: 'El tiempo promedio para una cocina completa es de 25-35 días hábiles, dependiendo de la complejidad del proyecto. Esto incluye diseño, fabricación e instalación.'
      },
      {
        id: 'faq-2',
        question: '¿Qué tipos de madera utilizan para las cocinas?',
        answer: 'Utilizamos principalmente eucalipto, pino y saligna para estructuras, y ofrecemos acabados en diversas maderas según el diseño. Todas nuestras maderas son de primera calidad y están debidamente tratadas.'
      },
      {
        id: 'faq-3',
        question: '¿Incluyen electrodomésticos en el proyecto?',
        answer: 'Nos enfocamos en la carpintería y mueblería. Sin embargo, podemos coordinar con proveedores de confianza para electrodomésticos y hacer las instalaciones necesarias.'
      },
      {
        id: 'faq-4',
        question: '¿Ofrecen garantía en sus trabajos?',
        answer: 'Sí, ofrecemos 5 años de garantía en estructura y 2 años en herrajes y acabados. Además, brindamos servicio post-venta para cualquier ajuste necesario.'
      }
    ],
    contact: {
      id: 'contact-cocinas',
      title: 'Solicita tu Presupuesto',
      description: 'Contáctanos para comenzar el diseño de tu cocina ideal. Te asesoramos sin compromiso.',
      phone: '01134976239',
      email: 'info@bauldemoda.com',
      whatsapp: '541134976239',
      address: 'Av. Dr. Honorio Pueyrredón 4625, Villa Rosa, Buenos Aires',
      workingHours: [
        { day: 'Lunes - Viernes', hours: '8:00 - 18:00' },
        { day: 'Sábados', hours: '8:00 - 13:00' },
        { day: 'Domingos', hours: 'Cerrado' }
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/bauldemoda/', icon: 'instagram' },
        { platform: 'facebook', url: 'https://www.facebook.com/bauldemoda', icon: 'facebook' }
      ]
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    slug: 'decks-exteriores',
    title: 'Decks Exteriores',
    category: 'Exteriores',
    status: 'active',
    seo: {
      title: 'Decks de Madera para Exteriores - Maderas Caballero',
      description: 'Construcción de decks y terrazas de madera. Diseños personalizados con maderas resistentes para espacios exteriores.',
      keywords: ['decks de madera', 'terrazas', 'espacios exteriores', 'quebracho', 'eucalipto'],
      ogImage: '/images/obra-deck.jpg',
      canonical: '/proyectos/decks-exteriores'
    },
    banner: {
      id: 'banner-decks',
      autoplayInterval: 5500,
      showControls: true,
      showIndicators: true,
      slides: [
        {
          id: 'slide-1',
          title: 'Decks Exteriores',
          subtitle: 'Espacios al Aire Libre',
          description: 'Transforma tu espacio exterior con nuestros decks de madera. Diseños que resisten el clima y embellecen tu hogar.',
          backgroundImage: '/images/obra-deck.jpg',
          ctaText: 'Ver Proyectos',
          ctaUrl: '#gallery',
          secondaryCtaText: 'Solicitar Visita',
          secondaryCtaUrl: '#contact',
          overlayOpacity: 0.5
        },
        {
          id: 'slide-2',
          title: 'Maderas Resistentes',
          subtitle: 'Durabilidad Garantizada',
          description: 'Utilizamos quebracho y eucalipto especialmente tratados para soportar todas las condiciones climáticas por años.',
          backgroundImage: '/images/madera-quebracho.jpg',
          ctaText: 'Conocer Materiales',
          ctaUrl: '#services',
          secondaryCtaText: 'Ver Garantía',
          secondaryCtaUrl: '#faqs',
          overlayOpacity: 0.6
        },
        {
          id: 'slide-3',
          title: '200+ Decks Construidos',
          subtitle: 'Experiencia Comprobada',
          description: 'Con más de 200 decks construidos, sabemos cómo crear el espacio exterior perfecto para tu hogar o negocio.',
          backgroundImage: '/images/madera-eucalipto.jpg',
          ctaText: 'Ver Testimonios',
          ctaUrl: '#testimonials',
          secondaryCtaText: 'Llamar Ahora',
          secondaryCtaUrl: 'tel:01134976239',
          overlayOpacity: 0.4
        }
      ]
    },
    info: {
      id: 'info-decks',
      title: 'Decks que Perduran',
      description: 'Construimos decks con maderas especialmente seleccionadas para exteriores, garantizando durabilidad y belleza por muchos años.',
      features: [
        {
          id: 'feature-1',
          icon: '🌦️',
          title: 'Resistente al Clima',
          description: 'Maderas tratadas especialmente para soportar lluvia, sol y cambios de temperatura.'
        },
        {
          id: 'feature-2',
          icon: '🏗️',
          title: 'Estructura Sólida',
          description: 'Construcción con técnicas profesionales que garantizan estabilidad y seguridad.'
        },
        {
          id: 'feature-3',
          icon: '🎯',
          title: 'Diseño Personalizado',
          description: 'Adaptamos cada proyecto a las características específicas de tu espacio.'
        }
      ],
      stats: [
        {
          id: 'stat-1',
          number: '200',
          label: 'Decks Construidos',
          suffix: '+'
        },
        {
          id: 'stat-2',
          number: '10',
          label: 'Años de Durabilidad'
        },
        {
          id: 'stat-3',
          number: '100',
          label: 'Satisfacción Cliente',
          suffix: '%'
        },
        {
          id: 'stat-4',
          number: '15',
          label: 'Días Promedio'
        }
      ]
    },
    services: [
      {
        id: 'service-1',
        title: 'Diseño y Planificación',
        description: 'Evaluamos tu espacio y diseñamos el deck perfecto, considerando drenaje, accesos y integración con el paisaje.',
        image: '/images/obra-deck.jpg',
        features: [
          'Relevamiento del terreno',
          'Diseño 3D del proyecto',
          'Cálculo de materiales',
          'Permisos municipales'
        ],
        price: {
          from: 25000,
          currency: '$',
          unit: 'm²'
        }
      },
      {
        id: 'service-2',
        title: 'Construcción del Deck',
        description: 'Construcción completa con maderas de quebracho o eucalipto, incluyendo estructura, tablones y acabados.',
        image: '/images/madera-quebracho.jpg',
        features: [
          'Estructura de quebracho',
          'Tablones seleccionados',
          'Tratamiento anti-hongos',
          'Fijaciones galvanizadas'
        ]
      },
      {
        id: 'service-3',
        title: 'Mantenimiento',
        description: 'Servicio de mantenimiento anual para preservar la belleza y durabilidad de tu deck.',
        image: '/images/madera-eucalipto.jpg',
        features: [
          'Limpieza profesional',
          'Aplicación de protectores',
          'Revisión de fijaciones',
          'Reparaciones menores'
        ]
      }
    ],
    gallery: {
      id: 'gallery-decks',
      title: 'Nuestros Decks',
      description: 'Proyectos de decks que hemos realizado en diferentes espacios',
      categories: ['Residenciales', 'Comerciales', 'Piscinas', 'Jardines'],
      items: [
        {
          id: 'img-1',
          title: 'Deck Residencial',
          description: 'Deck amplio para casa familiar con vista al jardín',
          image: '/images/obra-deck.jpg',
          category: 'Residenciales'
        },
        {
          id: 'img-2',
          title: 'Deck para Piscina',
          description: 'Deck perimetral de piscina con maderas de quebracho',
          image: '/images/madera-quebracho.jpg',
          category: 'Piscinas'
        },
        {
          id: 'img-3',
          title: 'Deck Comercial',
          description: 'Terraza para restaurante con capacidad para 40 personas',
          image: '/images/madera-eucalipto.jpg',
          category: 'Comerciales'
        }
      ]
    },
    testimonials: [
      {
        id: 'testimonial-1',
        name: 'Roberto Silva',
        role: 'Propietario',
        content: 'El deck transformó completamente nuestro patio. Después de 3 años sigue como nuevo, resistió perfectamente todas las tormentas.',
        rating: 5,
        avatar: '/placeholder.png'
      },
      {
        id: 'testimonial-2',
        name: 'Laura Fernández',
        role: 'Arquitecta Paisajista',
        content: 'Recomiendo Maderas Caballero para todos mis proyectos de decks. Su trabajo es impecable y siempre cumplen los plazos.',
        rating: 5,
        avatar: '/placeholder.png'
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question: '¿Qué madera es mejor para decks exteriores?',
        answer: 'Recomendamos quebracho para estructuras por su resistencia, y eucalipto o lapacho para tablones. Todas vienen con tratamiento para exteriores.'
      },
      {
        id: 'faq-2',
        question: '¿Cuánto mantenimiento requiere un deck?',
        answer: 'Con un mantenimiento anual básico (limpieza y aplicación de protector), tu deck puede durar más de 10 años en perfectas condiciones.'
      },
      {
        id: 'faq-3',
        question: '¿Realizan decks sobre piletas existentes?',
        answer: 'Sí, tenemos experiencia en decks flotantes y estructuras especiales para piletas existentes, respetando accesos y equipos.'
      }
    ],
    contact: {
      id: 'contact-decks',
      title: 'Construye tu Deck Ideal',
      description: 'Solicita una visita gratuita para evaluar tu espacio y recibir un presupuesto personalizado.',
      phone: '01134976239',
      email: 'info@bauldemoda.com',
      whatsapp: '541134976239',
      address: 'Av. Dr. Honorio Pueyrredón 4625, Villa Rosa, Buenos Aires',
      workingHours: [
        { day: 'Lunes - Viernes', hours: '8:00 - 18:00' },
        { day: 'Sábados', hours: '8:00 - 13:00' },
        { day: 'Domingos', hours: 'Cerrado' }
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/bauldemoda/', icon: 'instagram' },
        { platform: 'facebook', url: 'https://www.facebook.com/bauldemoda', icon: 'facebook' }
      ]
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    slug: 'muebles-medida',
    title: 'Muebles a Medida',
    category: 'Mobiliario',
    status: 'active',
    seo: {
      title: 'Muebles a Medida - Carpintería Maderas Caballero',
      description: 'Fabricación de muebles a medida para tu hogar u oficina. Diseños únicos con maderas de primera calidad.',
      keywords: ['muebles a medida', 'carpintería', 'muebles personalizados', 'estanterías', 'escritorios'],
      ogImage: '/images/obra-estanteria.jpg',
      canonical: '/proyectos/muebles-medida'
    },
    banner: {
      id: 'banner-muebles',
      autoplayInterval: 7000,
      showControls: true,
      showIndicators: true,
      slides: [
        {
          id: 'slide-1',
          title: 'Muebles a Medida',
          subtitle: 'Diseño Único para Tu Espacio',
          description: 'Creamos muebles únicos que se adaptan perfectamente a tu espacio y estilo de vida. Cada pieza es una obra de arte funcional.',
          backgroundImage: '/images/obra-estanteria.jpg',
          ctaText: 'Explorar Diseños',
          ctaUrl: '#gallery',
          secondaryCtaText: 'Consultar Precio',
          secondaryCtaUrl: '#contact',
          overlayOpacity: 0.4
        },
        {
          id: 'slide-2',
          title: 'Carpintería Artesanal',
          subtitle: 'Técnicas Tradicionales',
          description: 'Combinamos técnicas tradicionales de carpintería con herramientas modernas para crear muebles de calidad excepcional.',
          backgroundImage: '/images/obra-mesa-comedor.jpg',
          ctaText: 'Ver Proceso',
          ctaUrl: '#services',
          secondaryCtaText: 'Conocer Maderas',
          secondaryCtaUrl: '/shop',
          overlayOpacity: 0.5
        },
        {
          id: 'slide-3',
          title: '500+ Muebles Creados',
          subtitle: 'Experiencia y Calidad',
          description: 'Con más de 500 muebles creados, cada pieza refleja nuestro compromiso con la excelencia y la satisfacción del cliente.',
          backgroundImage: '/images/madera-grandis.jpg',
          ctaText: 'Ver Testimonios',
          ctaUrl: '#testimonials',
          secondaryCtaText: 'Iniciar Proyecto',
          secondaryCtaUrl: 'tel:01134976239',
          overlayOpacity: 0.6
        }
      ]
    },
    info: {
      id: 'info-muebles',
      title: 'Mobiliario Único',
      description: 'Cada mueble que creamos es único y está diseñado específicamente para tu espacio, necesidades y gustos personales.',
      features: [
        {
          id: 'feature-1',
          icon: '📐',
          title: 'Diseño Personalizado',
          description: 'Cada mueble es diseñado específicamente para tu espacio y necesidades particulares.'
        },
        {
          id: 'feature-2',
          icon: '🔨',
          title: 'Carpintería Artesanal',
          description: 'Técnicas tradicionales de carpintería combinadas con herramientas modernas de precisión.'
        },
        {
          id: 'feature-3',
          icon: '🌳',
          title: 'Maderas Nobles',
          description: 'Seleccionamos las mejores maderas para cada proyecto según uso y diseño.'
        }
      ],
      stats: [
        {
          id: 'stat-1',
          number: '500',
          label: 'Muebles Creados',
          suffix: '+'
        },
        {
          id: 'stat-2',
          number: '15',
          label: 'Años de Experiencia'
        },
        {
          id: 'stat-3',
          number: '95',
          label: 'Satisfacción Cliente',
          suffix: '%'
        },
        {
          id: 'stat-4',
          number: '20',
          label: 'Días Promedio'
        }
      ]
    },
    services: [
      {
        id: 'service-1',
        title: 'Estanterías y Bibliotecas',
        description: 'Diseñamos estanterías que aprovechan cada centímetro de tu espacio, desde bibliotecas clásicas hasta sistemas modulares modernos.',
        image: '/images/obra-estanteria.jpg',
        features: [
          'Diseño modular',
          'Aprovechamiento del espacio',
          'Diferentes alturas y profundidades',
          'Acabados personalizados'
        ],
        price: {
          from: 35000,
          currency: '$',
          unit: 'metro lineal'
        }
      },
      {
        id: 'service-2',
        title: 'Escritorios y Mesas',
        description: 'Mesas de trabajo, escritorios ejecutivos y mesas de comedor diseñadas para durar generaciones.',
        image: '/images/obra-mesa-comedor.jpg',
        features: [
          'Tableros de madera maciza',
          'Estructuras reforzadas',
          'Cajones con guías telescópicas',
          'Acabados resistentes'
        ]
      },
      {
        id: 'service-3',
        title: 'Placards y Vestidores',
        description: 'Sistemas de almacenamiento inteligente que maximizan el espacio y mantienen todo organizado.',
        image: '/images/madera-saligna.jpg',
        features: [
          'Distribución inteligente',
          'Herrajes de calidad',
          'Puertas con soft-close',
          'Iluminación LED integrada'
        ]
      }
    ],
    gallery: {
      id: 'gallery-muebles',
      title: 'Galería de Muebles',
      description: 'Una selección de nuestros muebles más destacados',
      categories: ['Estanterías', 'Escritorios', 'Mesas', 'Placards'],
      items: [
        {
          id: 'img-1',
          title: 'Biblioteca Modular',
          description: 'Sistema de estanterías modulares para living',
          image: '/images/obra-estanteria.jpg',
          category: 'Estanterías'
        },
        {
          id: 'img-2',
          title: 'Mesa de Comedor',
          description: 'Mesa de comedor para 8 personas en eucalipto',
          image: '/images/obra-mesa-comedor.jpg',
          category: 'Mesas'
        },
        {
          id: 'img-3',
          title: 'Escritorio Ejecutivo',
          description: 'Escritorio con cajones y compartimientos ocultos',
          image: '/images/madera-saligna.jpg',
          category: 'Escritorios'
        }
      ]
    },
    testimonials: [
      {
        id: 'testimonial-1',
        name: 'Patricia López',
        role: 'Diseñadora',
        content: 'Los muebles que me hicieron son exactamente lo que imaginaba. La calidad es excepcional y el diseño perfecto para mi estudio.',
        rating: 5,
        avatar: '/placeholder.png'
      },
      {
        id: 'testimonial-2',
        name: 'Miguel Torres',
        role: 'Empresario',
        content: 'Encargué todo el mobiliario para mi oficina. El resultado superó mis expectativas, tanto en diseño como en funcionalidad.',
        rating: 5,
        avatar: '/placeholder.png'
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question: '¿Pueden replicar un diseño que vi en internet?',
        answer: 'Sí, podemos tomar como referencia cualquier diseño y adaptarlo a tus medidas y necesidades específicas, siempre respetando derechos de autor.'
      },
      {
        id: 'faq-2',
        question: '¿Qué incluye el servicio de diseño?',
        answer: 'Incluye relevamiento del espacio, planos 2D y 3D, selección de materiales y asesoramiento completo hasta la instalación.'
      },
      {
        id: 'faq-3',
        question: '¿Realizan reparaciones de muebles antiguos?',
        answer: 'Sí, ofrecemos servicios de restauración y reparación de muebles antiguos, devolviendo su belleza original.'
      }
    ],
    contact: {
      id: 'contact-muebles',
      title: 'Diseña tu Mueble Ideal',
      description: 'Contáctanos para comenzar el diseño de tu mueble personalizado. Primera consulta sin costo.',
      phone: '01134976239',
      email: 'info@bauldemoda.com',
      whatsapp: '541134976239',
      address: 'Av. Dr. Honorio Pueyrredón 4625, Villa Rosa, Buenos Aires',
      workingHours: [
        { day: 'Lunes - Viernes', hours: '8:00 - 18:00' },
        { day: 'Sábados', hours: '8:00 - 13:00' },
        { day: 'Domingos', hours: 'Cerrado' }
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/bauldemoda/', icon: 'instagram' },
        { platform: 'facebook', url: 'https://www.facebook.com/bauldemoda', icon: 'facebook' }
      ]
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];
