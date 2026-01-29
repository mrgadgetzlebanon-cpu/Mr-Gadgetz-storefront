import rawCategoryStructure from "@/lib/categories-structure.json";

export type RawCategoryStructure = Record<string, Record<string, string[]>>;

export interface CategoryChild {
  name: string;
  handle: string;
  handles: string[];
  filters: string[];
}

export interface CategoryGroup {
  parent: string;
  parentHandles: string[];
  children: CategoryChild[];
  filters: string[];
}

export interface CategoryStructure {
  grouped: CategoryGroup[];
  byHandle: Record<string, CategoryChild & { parent: string }>;
  byParent: Record<string, CategoryGroup>;
}

export const categoryConfig: RawCategoryStructure =
  rawCategoryStructure as RawCategoryStructure;

function toHandle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dedupe(list: string[]): string[] {
  return Array.from(new Set(list.filter(Boolean)));
}

export function buildCategoryStructure(
  config: RawCategoryStructure,
): CategoryStructure {
  const grouped: CategoryGroup[] = [];
  const byHandle: Record<string, CategoryChild & { parent: string }> = {};
  const byParent: Record<string, CategoryGroup> = {};

  for (const [parent, children] of Object.entries(config)) {
    const childEntries: CategoryChild[] = Object.entries(children).map(
      ([childName, filters]) => {
        const handle = toHandle(childName);
        const normalizedFilters = dedupe(filters);
        const child: CategoryChild = {
          name: childName,
          handle,
          handles: [handle],
          filters: normalizedFilters,
        };
        byHandle[handle] = { ...child, parent };
        return child;
      },
    );

    const parentFilters = dedupe(
      childEntries.flatMap((child) => child.filters),
    );
    const parentHandles = childEntries.flatMap((child) => child.handles);

    const group: CategoryGroup = {
      parent,
      parentHandles,
      children: childEntries,
      filters: parentFilters,
    };

    grouped.push(group);
    byParent[parent] = group;
  }

  return { grouped, byHandle, byParent };
}

export const categoryStructure: CategoryStructure =
  buildCategoryStructure(categoryConfig);
