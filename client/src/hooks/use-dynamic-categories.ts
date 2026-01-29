import { useCallback, useMemo } from "react";
import {
  buildCategoryStructure,
  categoryConfig,
  CategoryStructure,
  CategoryChild,
} from "@/config/categoryStructure";

export function useDynamicCategories() {
  const categoryStructure: CategoryStructure = useMemo(
    () => buildCategoryStructure(categoryConfig),
    [],
  );

  const getChildByHandle = useCallback(
    (handle: string): (CategoryChild & { parent: string }) | null => {
      const match = categoryStructure.byHandle[handle];
      if (!match) return null;
      return { ...match, parent: categoryStructure.byHandle[handle].parent };
    },
    [categoryStructure],
  );

  const getFiltersForHandle = useCallback(
    (handle: string): string[] => {
      return categoryStructure.byHandle[handle]?.filters || [];
    },
    [categoryStructure],
  );

  const getFiltersForParent = useCallback(
    (parent: string): string[] => {
      return categoryStructure.byParent[parent]?.filters || [];
    },
    [categoryStructure],
  );

  const getHandlesForParent = useCallback(
    (parent: string): string[] => {
      return categoryStructure.byParent[parent]?.parentHandles || [];
    },
    [categoryStructure],
  );

  return {
    categoryStructure,
    getChildByHandle,
    getFiltersForHandle,
    getFiltersForParent,
    getHandlesForParent,
  };
}
