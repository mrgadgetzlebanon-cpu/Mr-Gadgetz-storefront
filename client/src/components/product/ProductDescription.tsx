import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  descriptionHtml?: string;
  description?: string;
  specs?: Record<string, string>;
  warranty?: string | null;
}

function parseDescriptionWithHiddenTag(
  html: string,
): { description: string; specs: string } | null {
  const hiddenTagRegex =
    /<span\s+id\s*=\s*["']?hidden["']?\s*(?:\/>|>\s*<\/span>)|<\/hidden>|<!--\s*hidden\s*-->|<div\s+id\s*=\s*["']?hidden["']?\s*(?:\/>|>\s*<\/div>)/i;

  const match = html.match(hiddenTagRegex);
  if (match && match.index !== undefined) {
    return {
      description: html.substring(0, match.index).trim(),
      specs: html.substring(match.index + match[0].length).trim(),
    };
  }

  return null;
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

  if (splitContent) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl border-b border-border/50 pb-3">
            Description
          </h3>
          <div
            className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: splitContent.description }}
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
                    dangerouslySetInnerHTML={{ __html: splitContent.specs }}
                  />
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
    );
  }

  const showBothColumns = hasDescription && (hasSpecs || hasWarranty);

  return (
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
              className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
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
  );
}
