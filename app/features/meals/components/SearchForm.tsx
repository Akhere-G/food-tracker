"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { searchFoods } from "../../food/actions";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Search, X } from "lucide-react";

export default function SearchForm({
  selectFood,
}: {
  selectFood: (food: FoodSearchItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FoodSearchItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    if (search.trim().length < 2) {
      return;
    }
    const currentRequest = ++requestId.current;
    async function getSearchResults() {
      setIsLoading(true);
      setErrorMessage("");
      const result = await searchFoods(search.trim());
      if (currentRequest !== requestId.current) return;

      if (result.success) {
        setResults(result.data);
      } else {
        setErrorMessage(result.error);
      }
      setIsLoading(false);
    }
    const timeout = setTimeout(getSearchResults, 300);

    return () => clearTimeout(timeout);
  }, [search]);

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
    <div>
      <label htmlFor="food-search" className="text-sm font-medium">Search for a food</label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input id="food-search" className="px-9" autoComplete="off" placeholder="Try chicken soup" onChange={(e) => updateSearch(e.target.value)} value={search} />
        {search && <button type="button" className="absolute right-2 top-2 rounded p-1 hover:bg-muted" onClick={() => updateSearch("")} aria-label="Clear search"><X className="size-4" /></button>}
      </div>
      {isLoading && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Searching…</p>}
      {errorMessage && <p className="mt-3 text-sm text-destructive" role="alert">{errorMessage}</p>}
      <div className="mt-4 flex flex-col">
        {results.map((result) => (
          <Button
            variant="ghost"
            key={result.id}
            className="text-left! justify-start"
            onClick={() => selectFood(result)}
          >
            {result.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
