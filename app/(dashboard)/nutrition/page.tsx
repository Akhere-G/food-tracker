import NutrientDetail from "@/app/features/nutrition/components/NutrientDetail";
import NutrientLedger from "@/app/features/nutrition/components/NutrientLedger";
import NutritionPageHeader from "@/app/features/nutrition/components/NutritionPageHeader";
import NutritionPeriodControls from "@/app/features/nutrition/components/NutritionPeriodControls";
import NutritionSummaryBand from "@/app/features/nutrition/components/NutritionSummaryBand";
import { parseNutritionPeriod } from "@/app/features/nutrition/period";
import { getNutritionReport } from "@/app/features/nutrition/service";

type NutritionPageSearchParams = Promise<{
  period?: string | string[];
  date?: string | string[];
  nutrient?: string | string[];
}>;

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: NutritionPageSearchParams;
}) {
  const query = await searchParams;
  const period = parseNutritionPeriod(singleValue(query.period));
  const { range, report } = await getNutritionReport({
    period,
    anchor: singleValue(query.date),
    nutrient: singleValue(query.nutrient),
  });

  return (
    <div className="page-shell">
      <NutritionPageHeader />
      <NutritionPeriodControls
        period={period}
        anchor={range.anchor}
        label={range.label}
        pickerValue={range.pickerValue}
        previous={range.previous}
        next={range.next}
        nutrient={report.selected.key}
      />
      <NutritionSummaryBand report={report} />
      <div className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-[minmax(19rem,0.85fr)_minmax(30rem,1.4fr)] lg:gap-14">
        <div className="order-2 min-w-0 border-t pt-8 lg:order-1 lg:border-t-0 lg:border-r lg:pr-12 lg:pt-0">
          <NutrientLedger
            metrics={report.metrics}
            selectedNutrient={report.selected.key}
            period={period}
            anchor={range.anchor}
          />
        </div>
        <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-8 lg:self-start">
          <NutrientDetail report={report} period={period} />
        </div>
      </div>
    </div>
  );
}

function singleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
