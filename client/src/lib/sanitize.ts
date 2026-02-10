import DOMPurify from "dompurify";
import type { Config } from "dompurify";

export function sanitizeHTML(html?: string, options?: Config): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, options) as string;
}
