import { PrismaClient, SettingType, SettingCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedSetting {
  key: string;
  value: string | null;
  type: SettingType;
  category: SettingCategory;
  description: string;
}

const defaultSettings: SeedSetting[] = [
  // Appearance
  {
    key: "appearance.theme",
    value: "theme-novus",
    type: SettingType.STRING,
    category: SettingCategory.APPEARANCE,
    description: "Tema visual del catálogo",
  },
  {
    key: "appearance.primary_color",
    value: "#2563eb",
    type: SettingType.STRING,
    category: SettingCategory.APPEARANCE,
    description: "Color primario del sitio",
  },
  {
    key: "appearance.logo_url",
    value: null,
    type: SettingType.STRING,
    category: SettingCategory.APPEARANCE,
    description: "URL del logo del sitio",
  },

  // SEO
  {
    key: "seo.default_title",
    value: "Morel Technology RD - Tienda de Tecnología",
    type: SettingType.STRING,
    category: SettingCategory.SEO,
    description: "Título por defecto del sitio",
  },
  {
    key: "seo.default_description",
    value: "Venta de laptops, computadoras y accesorios de tecnología en República Dominicana",
    type: SettingType.STRING,
    category: SettingCategory.SEO,
    description: "Meta descripción por defecto",
  },
  {
    key: "seo.og_image_url",
    value: null,
    type: SettingType.STRING,
    category: SettingCategory.SEO,
    description: "Imagen de Open Graph por defecto",
  },

  // Analytics
  {
    key: "analytics.google_analytics_id",
    value: null,
    type: SettingType.STRING,
    category: SettingCategory.ANALYTICS,
    description: "ID de Google Analytics (G-XXXXXXXXXX)",
  },
  {
    key: "analytics.google_tag_manager_id",
    value: null,
    type: SettingType.STRING,
    category: SettingCategory.ANALYTICS,
    description: "ID de Google Tag Manager (GTM-XXXXXXX)",
  },
  {
    key: "analytics.facebook_pixel_id",
    value: null,
    type: SettingType.STRING,
    category: SettingCategory.ANALYTICS,
    description: "ID de Facebook Pixel",
  },

  // Catalog
  {
    key: "catalog.enabled",
    value: "true",
    type: SettingType.BOOLEAN,
    category: SettingCategory.CATALOG,
    description: "Habilitar/deshabilitar el catálogo público",
  },
  {
    key: "catalog.show_out_of_stock",
    value: "true",
    type: SettingType.BOOLEAN,
    category: SettingCategory.CATALOG,
    description: "Mostrar productos agotados en el catálogo",
  },
  {
    key: "catalog.items_per_page",
    value: "12",
    type: SettingType.INTEGER,
    category: SettingCategory.CATALOG,
    description: "Número de productos por página",
  },

  // Commerce
  {
    key: "commerce.currency",
    value: "DOP",
    type: SettingType.STRING,
    category: SettingCategory.COMMERCE,
    description: "Moneda por defecto (DOP/USD)",
  },
  {
    key: "commerce.whatsapp_number",
    value: null,
    type: SettingType.STRING,
    category: SettingCategory.COMMERCE,
    description: "Número de WhatsApp para pedidos",
  },

  // System
  {
    key: "system.maintenance_mode",
    value: "false",
    type: SettingType.BOOLEAN,
    category: SettingCategory.SYSTEM,
    description: "Modo de mantenimiento del sitio",
  },
  {
    key: "system.contact_email",
    value: "info@moreltechnology.com",
    type: SettingType.STRING,
    category: SettingCategory.SYSTEM,
    description: "Email de contacto principal",
  },
];

async function main() {
  console.log("Seeding site settings...");

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(`  ✓ ${setting.key}`);
  }

  console.log("Site settings seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
