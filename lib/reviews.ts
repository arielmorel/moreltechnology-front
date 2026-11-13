import { cache } from "react";
import { getApprovedReviews } from "@/app/actions/reviews";

// Shared per-request cache so the product page (JSON-LD) and the reviews section
// read approved reviews with a single query.
export const getApprovedReviewsCached = cache(getApprovedReviews);
