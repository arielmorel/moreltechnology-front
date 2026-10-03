import { branches } from "../data/branches";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8282";
export const DEFAULT_BRANCH = "moreltechnology";

export function resolveBranchId(branchId?: string | null): string | undefined {
  if (!branchId) return undefined;
  return branches.some(b => b.id === branchId) ? branchId : undefined;
}

export function getCatalogUrl(branchId?: string): string {
  const branch = branchId || DEFAULT_BRANCH;
  return `${API_BASE_URL}/api/catalogs/${branch}/products`;
}

export function getFinancingUrl(): string {
  return `${API_BASE_URL}/api/company/${DEFAULT_BRANCH}/financing/requests`;
}