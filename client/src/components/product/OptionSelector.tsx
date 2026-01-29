import { cn } from "@/lib/utils";
import type { ProductOptionNode } from "@/hooks/use-product-variant";

interface OptionSelectorProps {
  options?: ProductOptionNode[];
  selectedOptions: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
}

export function OptionSelector({
  options,
  selectedOptions,
  onSelect,
}: OptionSelectorProps) {
  if (!options?.length) return null;

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const nameSlug = option.name.toLowerCase().replace(/\s+/g, "-");

        return (
          <div key={option.id} className="space-y-3">
            <span className="text-sm font-semibold">{option.name}</span>

            <div className="flex flex-wrap">
              {option.values.map((value, index) => {
                const isSelected = selectedOptions[option.name] === value;
                const valueSlug = value.toLowerCase().replace(/\s+/g, "-");
                const isFirst = index === 0;
                const isLast = index === option.values.length - 1;

                return (
                  <label
                    key={value}
                    className="relative"
                    data-testid={`option-${nameSlug}-${valueSlug}`}
                  >
                    <input
                      type="radio"
                      name={`option-${nameSlug}`}
                      value={value}
                      checked={isSelected}
                      onChange={() => onSelect(option.name, value)}
                      className="peer sr-only"
                    />

                    <span
                      className={cn(
                        // base
                        "block cursor-pointer bg-white px-3 py-1.5 text-center text-sm tracking-wider",
                        "text-[#3e4963] transition-colors duration-300",
                        "border border-[#b5bfd9]",
                        "-ml-px first:ml-0",

                        // rounded edges
                        isFirst && "rounded-l-md",
                        isLast && "rounded-r-md",

                        // checked
                        "peer-checked:bg-[#dee7ff]",
                        "peer-checked:text-[#0043ed]",
                        "peer-checked:border-[#0043ed]",
                        isSelected && "z-10",

                        // focus
                        "peer-focus-visible:outline-none",
                        "peer-focus-visible:ring-4",
                        "peer-focus-visible:ring-[#b5c9fc]",
                        "peer-focus-visible:ring-offset-0",

                        // dark mode
                        "dark:bg-background dark:text-foreground dark:border-border/60",
                      )}
                    >
                      {value}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
