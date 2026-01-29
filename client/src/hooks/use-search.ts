import { useState, useCallback } from "react";
import { useLocation } from "wouter";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      setLocation(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }, [query, setLocation]);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const clearQuery = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery: handleChange,
    handleKeyDown,
    clearQuery,
  };
}
