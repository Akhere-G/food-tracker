import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchForm from "./SearchForm";
import BarcodeForm from "./BarcodeForm";

export default function MealForm() {
  const tabs = [
    { triggerLabel: "Search", value: "search", content: <SearchForm /> },
    { triggerLabel: "Barcode", value: "barcode", content: <BarcodeForm /> },
  ];
  return (
    <div>
      <Tabs defaultValue={tabs[0].value}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.triggerLabel} value={tab.value}>
              {tab.triggerLabel}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.triggerLabel} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
