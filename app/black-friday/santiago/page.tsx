import type { Metadata } from "next";
import { BLACK_FRIDAY_BRANCHES } from "@/lib/black-friday";
import {
  BlackFridayLanding,
  blackFridayMetadata,
} from "@/components/black-friday/black-friday-landing";

// Santiago branch catalog (mts).
const BRANCH = BLACK_FRIDAY_BRANCHES.santiago;

export const dynamic = "force-dynamic";

export const metadata: Metadata = blackFridayMetadata(BRANCH);

export default function BlackFridaySantiagoPage() {
  return <BlackFridayLanding branch={BRANCH} />;
}
