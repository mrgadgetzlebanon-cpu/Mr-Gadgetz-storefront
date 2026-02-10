const SITE_NAME = "Mr. Gadgetz";
export const DEFAULT_TITLE = "Mr. Gadgetz | Premium Electronic Store";
export const DEFAULT_META_DESCRIPTION =
  "Shop the latest mobile phones, laptops, and premium tech accessories in Lebanon. Fast delivery, official warranty, and best prices on Apple, Samsung, and more.";
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || "https://mrgadgetz.net";

export function buildPageTitle(title?: string) {
  const safe = title?.trim();
  return safe ? `${safe} | ${SITE_NAME}` : DEFAULT_TITLE;
}

export function buildMetaDescription(description?: string | null) {
  const fallback = DEFAULT_META_DESCRIPTION;
  if (!description) return fallback;
  const text = description
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return fallback;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

export function buildCanonicalUrl(pathname?: string) {
  if (pathname && /^https?:\/\//i.test(pathname)) return pathname;
  const base = SITE_ORIGIN.replace(/\/$/, "");
  const path = pathname
    ? pathname.startsWith("/")
      ? pathname
      : `/${pathname}`
    : typeof window !== "undefined"
      ? window.location.pathname
      : "/";
  return `${base}${path || "/"}`;
}
