"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchFoods } from "@/app/features/food/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import FoodLookupSkeleton from "./FoodLookupSkeleton";

export default function SearchForm({
  selectFood,
}: {
  selectFood: (food: FoodSearchItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FoodSearchItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [composing, setComposing] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (composing || search.trim().length < 2) {
      return;
    }
    const currentRequest = ++requestId.current;
    async function getSearchResults() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const result = await searchFoods(search.trim());
        if (currentRequest !== requestId.current) return;
        if (result.success) {
          setResults(result.data);
        } else {
          setResults([]);
          setErrorMessage(result.error);
        }
      } catch {
        if (currentRequest !== requestId.current) return;
        setResults([]);
        setErrorMessage("We could not search for foods. Try again.");
      } finally {
        if (currentRequest === requestId.current) setIsLoading(false);
      }
    }
    const timeout = setTimeout(getSearchResults, 300);

    return () => {
      clearTimeout(timeout);
      requestId.current += 1;
    };
  }, [composing, search]);

  function updateSearch(value: string) {
    setSearch(value);
    if (value.trim().length < 2) {
      requestId.current += 1;
      setResults([]);
      setErrorMessage("");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-w-0">
      <label htmlFor="food-search" className="text-sm font-medium">
        Search for a food
      </label>
      <div className="relative mt-2 min-w-0">
        <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
        <Input
          id="food-search"
          className="min-w-0 px-9"
          autoComplete="off"
          placeholder="Try chicken soup"
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={(event) => {
            setComposing(false);
            updateSearch(event.currentTarget.value);
          }}
          onChange={(event) => updateSearch(event.target.value)}
          value={search}
        />
        {search && (
          <button
            type="button"
            className="absolute top-2 right-2 rounded p-1 hover:bg-muted"
            onClick={() => updateSearch("")}
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      {isLoading && <div className="mt-4"><FoodLookupSkeleton label="Searching foods…" /></div>}
      {errorMessage && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="mt-4 flex max-h-64 min-w-0 flex-col overflow-y-auto" hidden={isLoading}>
        {!isLoading && results.map((result) => (
          <Button
            variant="ghost"
            key={result.id}
            className="h-auto min-h-9 w-full min-w-0 justify-start py-2 text-left! whitespace-normal"
            onClick={() => selectFood(result)}
          >
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {result.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
