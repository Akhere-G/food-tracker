import * as z from "zod";

export const foodSearchItem = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  groupName: z.string(),
});

export type FoodSearchItem = z.infer<typeof foodSearchItem>;

export const foodDetail = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  groupName: z.string(),
  groupId: z.string().nullable(),
  sourceDatabase: z.string(),
  sourceUrl: z.string(),
});

export type FoodDetail = z.infer<typeof foodDetail>;

export const nutrientDetail = z.object({
  nutrientId: z.number(),
  name: z.string(),
  nameEn: z.string(),
  amount: z.number(),
  unit: z.string(),
  perAmount: z.number(),
  dailyValue: z.number().nullable(),
  upperLimit: z.number().nullable(),
  sortOrder: z.number(),
  categoryName: z.string(),
  slug: z.string(),
});

export type NutrientDetail = z.infer<typeof nutrientDetail>;

export const servingDetail = z.object({
  id: z.number(),
  amountGrams: z.number(),
  isDefault: z.boolean(),
  description: z.string(),
});

export type ServingDetail = z.infer<typeof servingDetail>;

export const foodDetailResponse = z.object({
  food: foodDetail,
  nutrients: z.array(nutrientDetail),
  servingSizes: z.array(servingDetail),
  meta: z.object({
    perAmount: z.number(),
    perAmountUnit: z.string(),
    locale: z.string(),
    source: z.string(),
  }),
});

export type FoodDetailResponse = z.infer<typeof foodDetailResponse>;
