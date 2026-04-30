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
    id: "santo_domingo",
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
    id: "santiago",
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
