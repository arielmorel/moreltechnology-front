import type { Metadata } from "next";
import { BLACK_FRIDAY_BRANCHES } from "@/lib/black-friday";
import {
  BlackFridayLanding,
  blackFridayMetadata,
} from "@/components/black-friday/black-friday-landing";

// Santo Domingo (default catalog). Santiago lives at /black-friday/santiago.
const BRANCH = BLACK_FRIDAY_BRANCHES.santoDomingo;

export const dynamic = "force-dynamic";

export const metadata: Metadata = blackFridayMetadata(BRANCH);

export default function BlackFridayPage() {
  return <BlackFridayLanding branch={BRANCH} />;
}
