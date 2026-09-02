/**
 * Centralized shipping configuration for Morel Technology.
 * Single source of truth for all shipping-related logic.
 */

// --- Gran Santo Domingo districts ---
export const GRAN_SANTO_DOMINGO_MUNICIPALITIES = [
  "Distrito Nacional",
  "Santo Domingo Este",
  "Santo Domingo Oeste",
  "Santo Domingo Norte",
] as const;

// --- Tarifas de envío (fijas) ---
export const SHIPPING_RATES = {
  GRAN_SANTO_DOMINGO: 350,
  REST_OF_DR: 800,
} as const;

export type ShippingZone = keyof typeof SHIPPING_RATES;

/**
 * Determina la zona de envío a partir del texto de dirección ingresado
 * en checkout. Si no se puede determinar, devuelve REST_OF_DR por defecto.
 */
export function getShippingZone(address: string): ShippingZone {
  const normalized = address
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const isGSD = GRAN_SANTO_DOMINGO_MUNICIPALITIES.some((m) => {
    const nm = m
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return normalized.includes(nm);
  });

  return isGSD ? "GRAN_SANTO_DOMINGO" : "REST_OF_DR";
}

/**
 * Retorna el costo de envío en DOP para una dirección dada.
 */
export function getShippingCost(address: string): number {
  return SHIPPING_RATES[getShippingZone(address)];
}

/**
 * Retorna un label legible de la zona.
 */
export function getShippingZoneLabel(zone: ShippingZone): string {
  return zone === "GRAN_SANTO_DOMINGO"
    ? "Gran Santo Domingo"
    : "Resto de República Dominicana";
}
