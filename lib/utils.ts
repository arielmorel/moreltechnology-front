import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function productUrl(slug: string): string {
  return `/productos/${slug}`
}

export function isMinioImage(src: string): boolean {
  return src.includes("localhost:9000") || src.includes("minio");
}

export interface ParsedSpecs {
  processor: string | null;
  ram: string | null;
  ssd: string | null;
  gpu: string | null;
  screenSize: string | null;
}

export function parseSpecsFromString(text: string): ParsedSpecs {
  if (!text) return { processor: null, ram: null, ssd: null, gpu: null, screenSize: null };

  const specs: ParsedSpecs = { processor: null, ram: null, ssd: null, gpu: null, screenSize: null };

  // Split by | or - (but handle dashes in processor names like "Ryzen 7 PRO-")
  // First try pipe delimiter
  let parts: string[];
  if (text.includes("|")) {
    parts = text.split("|").map(p => p.trim()).filter(Boolean);
  } else {
    // For dash delimiter, be smarter about it
    // Split by " - " (space dash space) which is more common between specs
    parts = text.split(/\s*-\s*/).map(p => p.trim()).filter(Boolean);
  }

  for (const part of parts) {
    // RAM pattern: 8GB, 16 GB, 16Ram, 32RAM, etc.
    if (!specs.ram && /\b(\d+)\s*(gb|ram)\b/i.test(part)) {
      const match = part.match(/(\d+)\s*(gb|ram)/i);
      if (match) specs.ram = `${match[1]}GB`;
      continue;
    }

    // SSD pattern: 256GB, 512 SSD, 1TB SSD, etc.
    if (!specs.ssd && /\b(\d+)\s*(gb|tb|ssd)\b/i.test(part)) {
      const match = part.match(/(\d+)\s*(gb|tb)/i);
      if (match) {
        const size = match[2].toLowerCase() === "tb" ? `${match[1]}TB` : `${match[1]}GB`;
        specs.ssd = size;
      } else {
        const ssdMatch = part.match(/(\d+)\s*ssd/i);
        if (ssdMatch) specs.ssd = `${ssdMatch[1]}GB`;
      }
      continue;
    }

    // GPU pattern: contains "gpu", "graphics", "dedicado", "dedicada", "nvidia", "radeon", "geforce"
    if (!specs.gpu && /(gpu|graphics|dedicad[oa]|nvidia|radeon|geforce|iris|uhd)/i.test(part)) {
      specs.gpu = part;
      continue;
    }

    // Screen size pattern: 14 pulgadas, 15.6", 13.3 pulgadas
    if (!specs.screenSize && /(\d+\.?\d*)\s*(pulgadas|"|")/i.test(part)) {
      const match = part.match(/(\d+\.?\d*)\s*(pulgadas|"|")/i);
      if (match) specs.screenSize = `${match[1]}"`;
      continue;
    }

    // Processor pattern: contains common CPU keywords
    if (!specs.processor && /(intel|amd|ryzen|core|i[3579]|xeon|celeron|pentium|m\d|snapdragon|mediaTek)/i.test(part)) {
      specs.processor = part;
      continue;
    }
  }

  return specs;
}
