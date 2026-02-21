import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeHTML } from "@/lib/sanitize";

interface ProductDescriptionProps {
  descriptionHtml?: string;
  description?: string;
  specs?: Record<string, string>;
  warranty?: string | null;
}

// ---------------------------------------------------------
// NEW SEO FIX: The HTML Interceptor
// This forces all Shopify-injected images to behave, preventing Layout Shifts.
// ---------------------------------------------------------
function optimizeInjectedHtml(htmlString: string): string {
  if (!htmlString) return "";

  // 1. First run your standard sanitizer to remove malicious scripts
  let safeHtml = sanitizeHTML(htmlString);

  // 2. Intercept all <img> tags and inject performance attributes
  // We add loading="lazy" and force a CSS aspect ratio to stop layout shifting
  safeHtml = safeHtml.replace(/<img([^>]*)>/gi, (match, attributes) => {
    // If the image already has lazy loading, keep it, otherwise add it
    const hasLazy = /loading=["']lazy["']/i.test(attributes);
    let newAttributes = attributes;

    if (!hasLazy) {
      newAttributes += ' loading="lazy" decoding="async"';
    }

    // Force inline CSS to maintain aspect ratio and prevent CLS
    // even if exact width/height are missing from Shopify
    newAttributes +=
      ' style="max-width: 100%; height: auto; aspect-ratio: auto;"';

    return `<img${newAttributes}>`;
  });

  return safeHtml;
}
// ---------------------------------------------------------

function parseDescriptionWithHiddenTag(
  html: string,
): { description: string; specs: string } | null {
  const markers: RegExp[] = [
    /<span[^>]*id\s*=\s*["']?hidden["']?[^>]*>[\s\S]*?<\/span>/i,
    /<div[^>]*id\s*=\s*["']?hidden["']?[^>]*>[\s\S]*?<\/div>/i,
    //i,
    /<\/hidden>/i,
    /<p>\s*(?:&nbsp;|&#160;|\u00a0|<br\s*\/?\s*>|\s)*<\/p>/i,
  ];

  let earliest: { index: number; length: number } | null = null;

  for (const regex of markers) {
    const match = regex.exec(html);
    if (match && match.index !== undefined) {
      const idx = match.index;
      const len = match[0].length;
      if (!earliest || idx < earliest.index) {
        earliest = { index: idx, length: len };
      }
    }
  }

  if (!earliest) return null;

  const description = html.substring(0, earliest.index).trim();
  const specs = html.substring(earliest.index + earliest.length).trim();

  if (!description || !specs) return null;

  return { description, specs };
}

export function ProductDescription({
  descriptionHtml,
  description,
  specs,
  warranty,
}: ProductDescriptionProps) {
  const [specsOpen, setSpecsOpen] = useState(false);
  const [warrantyOpen, setWarrantyOpen] = useState(false);

  const hasDescription = descriptionHtml || description;
  const hasSpecs = specs && Object.keys(specs).length > 0;
  const hasWarranty =
    typeof warranty === "string" && warranty.trim().length > 0;

  if (!hasDescription && !hasSpecs && !hasWarranty) {
    return null;
  }

  const splitContent = descriptionHtml
    ? parseDescriptionWithHiddenTag(descriptionHtml)
    : null;
  const hasSpecsFromHtml = splitContent?.specs && splitContent.specs.length > 0;

  const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="pointer-events-auto bg-white border border-white/50 rounded-3xl p-6 md:p-10 shadow-2xl">
      {children}
    </div>
  );

  return (
    <Container>
      <div
        className={
          splitContent || (hasDescription && (hasSpecs || hasWarranty))
            ? "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            : "w-full"
        }
      >
        {/* LEFT COLUMN: DESCRIPTION */}
        {hasDescription && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl border-b border-border/50 pb-3">
              Description
            </h3>
            {descriptionHtml ? (
              <div
                className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none max-h-[45vh] overflow-y-auto pr-1"
                dangerouslySetInnerHTML={{
                  // Applied the new optimizer here
                  __html: optimizeInjectedHtml(
                    splitContent ? splitContent.description : descriptionHtml,
                  ),
                }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: SPECS & WARRANTY */}
        {(hasSpecsFromHtml || hasSpecs || hasWarranty) && (
          <div className="space-y-4">
            {/* SPECS FROM HTML SPLIT */}
            {hasSpecsFromHtml && (
              <>
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between font-display font-bold text-xl border-b border-border/50 pb-3 hover:text-[#0c57ef] dark:hover:text-[#48bfef] transition-colors"
                  data-testid="button-toggle-specs"
                >
                  <span>Technical Specifications</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      specsOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    specsOpen ? "max-h-[35vh] overflow-y-auto" : "max-h-0",
                  )}
                >
                  <div
                    className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      // Applied the new optimizer here
                      __html: optimizeInjectedHtml(splitContent.specs),
                    }}
                  />
                </div>
              </>
            )}

            {/* SPECS FROM JSON OBJECT */}
            {hasSpecs && !hasSpecsFromHtml && (
              <>
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between font-display font-bold text-xl border-b border-border/50 pb-3 hover:text-[#0c57ef] dark:hover:text-[#48bfef] transition-colors"
                  data-testid="button-toggle-specs"
                >
                  <span>Technical Specifications</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      specsOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    specsOpen ? "max-h-[35vh] overflow-y-auto" : "max-h-0",
                  )}
                >
                  <div className="space-y-3">
                    {Object.entries(specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-border/30"
                      >
                        <span className="text-muted-foreground text-sm">
                          {key}
                        </span>
                        <span className="font-medium text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* WARRANTY */}
            {hasWarranty && (
              <>
                <button
                  onClick={() => setWarrantyOpen(!warrantyOpen)}
                  className="w-full flex items-center justify-between font-display font-bold text-xl border-b border-border/50 pb-3 hover:text-[#0c57ef] dark:hover:text-[#48bfef] transition-colors"
                  data-testid="button-toggle-warranty"
                >
                  <span>Warranty Information</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      warrantyOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    warrantyOpen ? "max-h-[35vh] overflow-y-auto" : "max-h-0",
                  )}
                >
                  <div className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {warranty}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
