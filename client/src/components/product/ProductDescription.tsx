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

function parseDescriptionWithHiddenTag(
  html: string,
): { description: string; specs: string } | null {
  const markers: RegExp[] = [
    /<span[^>]*id\s*=\s*["']?hidden["']?[^>]*>.*?<\/span>/is,
    /<div[^>]*id\s*=\s*["']?hidden["']?[^>]*>.*?<\/div>/is,
    /<!--\s*hidden\s*-->/i,
    /<\/hidden>/i,
    // Shopify sometimes replaces the marker with an empty paragraph or nbsp
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

  if (splitContent) {
    return (
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl border-b border-border/50 pb-3">
              Description
            </h3>
            <div
              className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none max-h-[45vh] overflow-y-auto pr-1"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(splitContent.description),
              }}
            />
          </div>

          {(hasSpecsFromHtml || hasWarranty) && (
            <div className="space-y-4">
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
                        __html: sanitizeHTML(splitContent.specs),
                      }}
                    />
                  </div>
                </>
              )}

              {hasWarranty && (
                <>
                  <button
                    onClick={() => setWarrantyOpen(!warrantyOpen)}
                    className="w-full flex items-center justify-between font-display font-bold text-xl border-b border-border/50 pb-3 hover:text-[#0c57ef] dark:hover-text-[#48bfef] transition-colors"
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

  const showBothColumns = hasDescription && (hasSpecs || hasWarranty);

  return (
    <Container>
      <div
        className={
          showBothColumns
            ? "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            : "w-full"
        }
      >
        {hasDescription && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl border-b border-border/50 pb-3">
              Description
            </h3>
            {descriptionHtml ? (
              <div
                className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none max-h-[45vh] overflow-y-auto pr-1"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(descriptionHtml),
                }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {(hasSpecs || hasWarranty) && (
          <div className="space-y-4">
            {hasSpecs && (
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
