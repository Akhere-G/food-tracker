"use client";
import { Input } from "@/components/ui/input";
import { useDeferredValue, useEffect, useState } from "react";
import { searchFoods } from "../../food/actions";
import { FoodSearchItem } from "@/integrations/all-nutrients/schema";
import { Button } from "@/components/ui/button";

export default function SearchForm({
  selectFood,
}: {
  selectFood: (food: FoodSearchItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FoodSearchItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const defferedSearch = useDeferredValue(search);

  useEffect(() => {
    async function getSearchResults() {
      setIsLoading(true);
      const result = await searchFoods(defferedSearch);

      if (result.success) {
        setResults(result.data);
      } else {
        setErrorMessage(result.error);
      }
      setIsLoading(false);
    }
    const timeout = setTimeout(getSearchResults, 400);

    return () => clearTimeout(timeout);
  }, [defferedSearch]);

  return (
    <div>
      <Input onChange={(e) => setSearch(e.target.value)} value={search} />
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
