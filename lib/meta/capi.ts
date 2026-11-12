import { createHash } from "node:crypto";

const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";
const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

export interface CapiUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface CapiCustomData {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: { id: string; quantity: number; item_price: number }[];
  num_items?: number;
  order_id?: string;
  lead_type?: string;
  search_string?: string;
  method?: string;
  location?: string;
  [key: string]: unknown;
}

export interface CapiEventInput {
  eventName: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website" | "system_generated" | "other";
  userData?: CapiUserData;
  customData?: CapiCustomData;
}

interface CapiResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : value.trim();
}

function hash(value?: string, normalizer: (value: string) => string = normalize): string | undefined {
  if (!value) return undefined;

  const normalized = normalizer(value);
  if (!normalized) return undefined;

  return createHash("sha256").update(normalized).digest("hex");
}

function splitName(fullName?: string): { firstName?: string; lastName?: string } {
  if (!fullName) return {};

  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

function buildUserData(userData: CapiUserData = {}): Record<string, string | string[]> {
  const nameParts = splitName(userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.firstName);
  const firstName = userData.firstName ? splitName(userData.firstName).firstName : nameParts.firstName;
  const lastName = userData.lastName ?? nameParts.lastName;

  const hashed: Record<string, string | string[] | undefined> = {
    em: hash(userData.email),
    ph: hash(userData.phone, normalizePhone),
    fn: hash(firstName),
    ln: hash(lastName),
    external_id: hash(userData.externalId),
    client_ip_address: userData.clientIpAddress,
    client_user_agent: userData.clientUserAgent,
    fbp: userData.fbp,
    fbc: userData.fbc,
  };

  return Object.fromEntries(
    Object.entries(hashed).filter((entry): entry is [string, string | string[]] => Boolean(entry[1]))
  );
}

export async function sendCapiEvent(input: CapiEventInput): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!isMetaCapiConfigured()) {
    return { ok: false, skipped: true, error: "Meta CAPI is not configured" };
  }

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: input.actionSource ?? "website",
        user_data: buildUserData(input.userData),
        custom_data: input.customData,
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN!)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = (await response.json().catch(() => null)) as CapiResponse | null;

    if (!response.ok || data?.error) {
      return {
        ok: false,
        error: data?.error?.message || `Meta CAPI request failed with status ${response.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Meta CAPI error",
    };
  }
}
