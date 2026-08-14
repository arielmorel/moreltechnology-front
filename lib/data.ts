export type ProductCondition = "Nuevo" | "Usado - Como Nuevo" | "Usado - Buen Estado";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  processor: string;
  ram: string;
  ssd: string;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  images: string[];
  description: string;
  featured?: boolean;
  tags: string[];
  quantity: number;
}

export const categories = [
  {
    id: "laptop",
    name: "Laptops",
    description: "Equipos de alto rendimiento, nuevos y usados certificados",
    image: "/images/category-laptop.png?q=80&w=2068&auto=format&fit=crop",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    description: "Cargadores, mouses, teclados y más periféricos",
    image: "/images/category-accessories.png?q=80&w=2070&auto=format&fit=crop",
  }
];

export const bankAccounts = [
  {
    bank: "Banco Popular",
    accountNumber: "791861198",
    accountType: "Ahorros",
    currency: "DOP",
    holder: "Ariel Morel",
  },
  {
    bank: "Banreservas",
    accountNumber: "9607385266",
    accountType: "Ahorros",
    currency: "DOP",
    holder: "MorelTechnology SRL",
  },
  {
    bank: "Banco BHD",
    accountNumber: "16323500027",
    accountType: "Ahorros",
    currency: "DOP",
    holder: "Ariel Morel",
  }
];

export const branches = [
  {
    id: "moreltechnology",
    name: "Sucursal Santo Domingo",
    address: "El eden de villa mella, Calle Ceuta Frente a la calle 7",
    phone: "809-617-5517",
    whatsappLink: "https://wa.me/18096175517",
    whatsappNumber: "18096175517",
    email: "moreltechnology@gmail.com",
    mapLink: "https://maps.app.goo.gl/wr9C6vxjkYwtECVt8",
    embedLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.854159261087!2d-69.8955395!3d18.535491500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89fb6a341ad5%3A0xa6c8a4c6714a050c!2sMorel%20Technology!5e0!3m2!1sen!2sdo!4v1777568616639!5m2!1sen!2sdo",
    socials: {
      instagram: "https://instagram.com/moreltechnology",
      facebook: "https://facebook.com/moreltechnology",
      tiktok: "https://tiktok.com/@moreltechnology8",
    },
    color: "from-blue-500/10 to-primary/5",
  },
  {
    id: "mts",
    name: "Sucursal Santiago",
    address: "Plaza Pamela 3, Carr. Buena Vista, Santiago",
    phone: "809-421-5517",
    whatsappLink: "https://wa.me/18094215517",
    whatsappNumber: "18094215517",
    email: "moreltechnologysantiago@gmail.com",
    mapLink: "https://maps.app.goo.gl/zqzPDppEykTHk5U88",
    embedLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.4221745077207!2d-70.68348932311183!3d19.480464339147282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c5070be6ed3d%3A0xf425afd02d656c3e!2sMorelTecnology%20Santiago!5e0!3m2!1sen!2sdo!4v1777568370910!5m2!1sen!2sdo",
    socials: {
      instagram: "https://instagram.com/moreltechnologysantiago",
      facebook: "https://facebook.com/moreltechnologysantiago",
      tiktok: "https://tiktok.com/@moreltechnologysantiago",
    },
    color: "from-primary/10 to-purple-500/5",
  }
];

export type AppCondition = "Gratis" | "Pago";

export interface App {
  id: string;
  name: string;
  description: string;
  packageName: string;
  icon: string;
  screenshots: string[];
  category: string;
  condition: AppCondition;
  featured?: boolean;
  tags: string[];
  downloads: string;
  rating: number;
  url: string;
}

export const apps: App[] = [
  {
    id: "english",
    name: "English Verbs",
    description: "Aprende conjugación de verbos en inglés con audio y más de 2000 verbos en 16 tiempos.",
    packageName: "com.arielmorel.learningenglish",
    icon: "/images/apps/english.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/P79pS6lnkdoqpe9EfPLmnJ_2B5AfERm2f5NnRFcnJn6qrHCHP_KNigdd7LZd1VuASqg2pAiVWtA7gVNTOJgiVVI=w526-h296-rw",
      "https://play-lh.googleusercontent.com/0ViWk5OI4H6CfIKpxX-niH5pw7uSA7eBjeGJHzcasBXXidle_2U36MvNeDTt_n9YRLG9pDVny3W8RBep8zxn=w526-h296-rw",
    ],
    category: "Education",
    condition: "Gratis",
    featured: true,
    tags: ["English", "Verbs", "Offline"],
    downloads: "50K+",
    rating: 4.1,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.learningenglish",
  },
  {
    id: "english-pro",
    name: "English Verbs PRO",
    description: "Versión PRO con más verbos, sin anuncios y función de favoritos. Domina la conjugación inglesa.",
    packageName: "com.arielmorel.aprenderverbospro",
    icon: "/images/apps/english.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/DOvxXAOvCvlAepJixqk7p2xE7XUT4s9lROMgBIbLl1Ks-itUXUtU5iF4feiVi-RocKZ1xhbxwF0itnrH16Lm=w526-h296-rw",
      "https://play-lh.googleusercontent.com/yyJ8jr8PyDT6zIytdTGB1DKqXMI6T3Q8n6IQ7rbVVMG4I5jy3tHeECg9Hgq45X_NxSvHiCXksbw5RTWDpH3Mzw=w526-h296-rw",
    ],
    category: "Education",
    condition: "Pago",
    tags: ["English", "Verbs", "PRO", "Offline"],
    downloads: "1K+",
    rating: 4.5,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.aprenderverbospro",
  },
  {
    id: "french-pro",
    name: "Verbs In French PRO",
    description: "Aprende conjugación de verbos en francés con más de 2000 verbos en 16 tiempos y audio.",
    packageName: "com.arielmorel.conjugate.frenchverbs.pro",
    icon: "/images/apps/french.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/HOtaT7cGnFlzhlqi188H7Vh3XJhnFGdhd1Rx7IkkWZbg7k-Lf3kV0_q6I4O3J3ZjWx2LUucP03G8tjV_7-5mSHo=w526-h296-rw",
    ],
    category: "Education",
    condition: "Pago",
    tags: ["French", "Verbs", "PRO", "Offline"],
    downloads: "10+",
    rating: 4.3,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.frenchverbs.pro",
  },
  {
    id: "german",
    name: "Verbs In German",
    description: "Aprende conjugación de verbos en alemán con audio y más de 2000 verbos en 16 tiempos.",
    packageName: "com.arielmorel.conjugate.germanverbs",
    icon: "/images/apps/german.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/EXsqOTzT_b99oDao-RQ8nYttgaMmScSD9v5VRi4v29B-9_gF4UXpUTPIBQf-Mzkvr_PntTjL6zAfVzqbOKkf=w526-h296-rw",
    ],
    category: "Education",
    condition: "Gratis",
    featured: true,
    tags: ["German", "Verbs", "Offline"],
    downloads: "1K+",
    rating: 4.2,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.germanverbs",
  },
  {
    id: "german-pro",
    name: "Verbs In German PRO",
    description: "Versión PRO de verbos alemanes con más funciones y sin anuncios.",
    packageName: "com.arielmorel.conjugate.germanverbs.pro",
    icon: "/images/apps/german.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/9ludEPoWgS17OiY6KuQdxkRp0vlo8acMMMBUvRrUsOLqVR8YDCCkkzfKPj2u65_isaaC78m_O5DmTeP1PSVn=w526-h296-rw",
    ],
    category: "Education",
    condition: "Pago",
    tags: ["German", "Verbs", "PRO", "Offline"],
    downloads: "100+",
    rating: 4.4,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.germanverbs.pro",
  },
  {
    id: "french",
    name: "Verbs In French",
    description: "Aprende conjugación de verbos en francés gratis con audio y más de 2000 verbos.",
    packageName: "com.arielmorel.conjugate.frenchverbs",
    icon: "/images/apps/french.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/HOtaT7cGnFlzhlqi188H7Vh3XJhnFGdhd1Rx7IkkWZbg7k-Lf3kV0_q6I4O3J3ZjWx2LUucP03G8tjV_7-5mSHo=w526-h296-rw",
    ],
    category: "Education",
    condition: "Gratis",
    tags: ["French", "Verbs", "Offline"],
    downloads: "500+",
    rating: 4.0,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.frenchverbs",
  },
  {
    id: "italian-pro",
    name: "Verbs In Italian PRO",
    description: "Aprende conjugación de verbos en italiano con más de 2000 verbos y audio.",
    packageName: "com.arielmorel.conjugate.italianverbs.pro",
    icon: "/images/apps/italian.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/wBFqwARpA1hayrbmGqD4u4eUF4VjRSCicsFPQy10gIcfjLkefPe3g5hg4kn6mZ7m-PDLgMApulxZcFHFJdnsDw=s64-rw",
    ],
    category: "Education",
    condition: "Pago",
    tags: ["Italian", "Verbs", "PRO", "Offline"],
    downloads: "100+",
    rating: 4.1,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.italianverbs.pro",
  },
  {
    id: "italian",
    name: "Verbs In Italian",
    description: "Aprende conjugación de verbos en italiano gratis con audio.",
    packageName: "com.arielmorel.conjugate.italianverbs",
    icon: "/images/apps/italian.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/wBFqwARpA1hayrbmGqD4u4eUF4VjRSCicsFPQy10gIcfjLkefPe3g5hg4kn6mZ7m-PDLgMApulxZcFHFJdnsDw=s64-rw",
    ],
    category: "Education",
    condition: "Gratis",
    tags: ["Italian", "Verbs", "Offline"],
    downloads: "500+",
    rating: 3.9,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.italianverbs",
  },
  {
    id: "portuguese-pro",
    name: "Verbs In Portuguese PRO",
    description: "Aprende conjugación de verbos en portugués con voz y más de 2000 verbos.",
    packageName: "com.arielmorel.conjugate.portugueseverbs.pro",
    icon: "/images/apps/portuguese.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/bQmdItjSyQHNv_OozrINf5_5p6XQ88Fgz1Jw5GqcWzwcFBZpI6teoIaKzuDP2IkKNQJ9H_EmFPviYrxa9mJO=s64-rw",
    ],
    category: "Education",
    condition: "Pago",
    tags: ["Portuguese", "Verbs", "PRO", "Offline"],
    downloads: "100+",
    rating: 4.2,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.portugueseverbs.pro",
  },
  {
    id: "portuguese",
    name: "Verbs In Portuguese",
    description: "Aprende conjugación de verbos en portugués gratis con audio.",
    packageName: "com.arielmorel.conjugate.portugueseverbs",
    icon: "/images/apps/portuguese.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/bQmdItjSyQHNv_OozrINf5_5p6XQ88Fgz1Jw5GqcWzwcFBZpI6teoIaKzuDP2IkKNQJ9H_EmFPviYrxa9mJO=s64-rw",
    ],
    category: "Education",
    condition: "Gratis",
    tags: ["Portuguese", "Verbs", "Offline"],
    downloads: "500+",
    rating: 4.1,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.portugueseverbs",
  },
  {
    id: "spanish-pro",
    name: "Verbs In Spanish PRO",
    description: "Aprende conjugación de verbos en español con más de 2000 verbos y audio.",
    packageName: "com.arielmorel.conjugate.spanishverbs.pro",
    icon: "/images/apps/spanish.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/pfBr3mC5LXgcvUajsSLLkdj0OFA5qj35CXXnWZE1ytrf2YCBHHLlTM7KAM4iTgWDNsM1a4576mAbifqAzKbCOUY=s64-rw",
    ],
    category: "Education",
    condition: "Pago",
    tags: ["Spanish", "Verbs", "PRO", "Offline"],
    downloads: "1K+",
    rating: 4.3,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.spanishverbs.pro",
  },
  {
    id: "spanish",
    name: "Verbs In Spanish",
    description: "Aprende conjugación de verbos en español gratis con audio.",
    packageName: "com.arielmorel.conjugate.spanishverbs",
    icon: "/images/apps/spanish.png",
    screenshots: [
      "https://play-lh.googleusercontent.com/pfBr3mC5LXgcvUajsSLLkdj0OFA5qj35CXXnWZE1ytrf2YCBHHLlTM7KAM4iTgWDNsM1a4576mAbifqAzKbCOUY=s64-rw",
    ],
    category: "Education",
    condition: "Gratis",
    tags: ["Spanish", "Verbs", "Offline"],
    downloads: "1K+",
    rating: 4.2,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.conjugate.spanishverbs",
  },
  {
    id: "dominoscore",
    name: "Domino Score",
    description: "La forma más fácil de llevar el puntaje de tus partidas de dominó. Ideal para juegos casuales y competitivos.",
    packageName: "com.arielmorel.dominoscore",
    icon: "https://play-lh.googleusercontent.com/asdpfIpZkB6MRxKuhdbLZKl_uL2jFn2PQUa70HWHX51EqWxDTVU2keQLbUmE4JZTJwE6YlBVj7icLlTtzM2XSvw=w240-h480-rw",
    screenshots: [
      "https://play-lh.googleusercontent.com/xWbcCvBIty8_Y9K7OionIbya8hV1CnhTvN2T3eeUUjyGGy3xPrKWmuf2Y92T6AS6EaDT7lemstQe8yvG2VdVzA=w526-h296-rw",
      "https://play-lh.googleusercontent.com/FvdfpiaTGZcfP9mvZ_0NgpLxF23p_bdrr3VTwugn9m7si5IGV-G-bNtUsewLuc_kgXo0y3ETKit59tm6p8mePw=w526-h296-rw",
      "https://play-lh.googleusercontent.com/ORSlwRQT_hvWT6-VJ-t9WKzZ4YLmdIdn1QgsZJVowXKAZRNH9bzK4IO199YUDc4bJ49PO_M5HBvQJvPSgbLWYQ=w526-h296-rw",
    ],
    category: "Sports",
    condition: "Gratis",
    tags: ["Domino", "Score", "Game"],
    downloads: "500+",
    rating: 0,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.dominoscore",
  },
  {
    id: "poolscore",
    name: "PoolScore",
    description: "Scoreboard minimalista para partidas de pool y billar. Registra resultados y sigue el ganador en tiempo real.",
    packageName: "com.arielmorel.poolmanager",
    icon: "https://play-lh.googleusercontent.com/bUn67pudB-nfwFP0jo0CSUAcFS_jq6-MkKIpJYni7KC7ZiSFrnR7cdNfefEAa0ZA1elq1cvxWrgNJ4RMKufAXg=w240-h480-rw",
    screenshots: [
      "https://play-lh.googleusercontent.com/d1Xl4hHPwz71TIsiuG4PQnBOD86GwTYYZ6ITDZ4v6CUjSKdRlNcBXWCGoGoaBOdLw1Trvl_mT7PJA0rc_OqFmA=w526-h296-rw",
      "https://play-lh.googleusercontent.com/muyosDJKXV5XAwXXdHir8AZBATsu8BSEXQG7T2HPZF7XdGr71H4HMnSU0JZk9TYfKdBq9g3k9_3uz9tUcGjszg=w526-h296-rw",
      "https://play-lh.googleusercontent.com/CJIdgiGyrndbnONVjqm2ctnJiYQdC7Y4PYarGxLJlCGY_L8WdqjFeP5b_1_5RJ5qrMnUvFHM9LGqRVLOcayWkQ=w526-h296-rw",
    ],
    category: "Sports",
    condition: "Gratis",
    tags: ["Pool", "Billiards", "Score"],
    downloads: "100+",
    rating: 0,
    url: "https://play.google.com/store/apps/details?id=com.arielmorel.poolmanager",
  },
];

export const appCategories = [
  "todas",
  "Education",
  "Sports",
];

export const reviews = [
  {
    id: 1,
    author: "Proyecto Tomca",
    content: "La mejor opción para los estudiantes y emprendedores, equipos con buen precio y excelente condiciones.",
    rating: 5,
    date: "Hace 1 año",
    avatar: "/images/review-1.png",
  },
  {
    id: 2,
    author: "Franklin0987 De Leon",
    content: "Muy buen servicio. Recomendado 100%.",
    rating: 5,
    date: "Hace 1 año",
    avatar: "/images/review-2.png",
  },
  {
    id: 3,
    author: "Daniel Gomez",
    content: "La mejor tienda del pais. Equipos de alta gama a precios increíbles.",
    rating: 5,
    date: "Hace 1 año",
    avatar: "/images/review-1.png",
  },
  {
    id: 4,
    author: "FREE AUDIO MUSIC OFICIAL",
    content: "Recomiendo este lugar para comprar sus laptop. Trato muy profesional.",
    rating: 5,
    date: "Hace 1 año",
    avatar: "/images/review-4.png",
  },
  {
    id: 5,
    author: "MundoGamingRD",
    content: "Lo mejor en el mercado. Si buscas calidad y buen precio, este es el lugar.",
    rating: 5,
    date: "Hace 11 meses",
    avatar: "/images/review-5.png",
  }
];
