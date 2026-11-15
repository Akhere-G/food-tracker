import { Meal } from "@/db/food-schema";

export const meals: Meal[] = [
  {
    id: "meal-breakfast",
    userId: "test-user",
    eatenAt: "2026-11-02T08:00:00.000Z",
    entries: [
      {
        id: "entry-1",
        mealId: "meal-breakfast",
        amountInGrams: "80",
        servingId: "serving-oats",
        servingQuantity: "1",
        serving: {
          id: "serving-oats",
          externalId: "oats-80g",
          foodId: "food-oats",
          label: "80g serving",
          amountInGrams: "80",
        },
        food: {
          id: "food-oats",
          name: "Oats",
          externalId: "food-oats",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "389",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "16.9",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "66.3",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "6.9",
            },
          ],
        },
      },
      {
        id: "entry-2",
        mealId: "meal-breakfast",
        amountInGrams: "200",
        servingId: "serving-milk",
        servingQuantity: "1",
        serving: {
          id: "serving-milk",
          externalId: "cup",
          foodId: "food-milk",
          label: "200ml cup",
          amountInGrams: "200",
        },
        food: {
          id: "food-milk",
          name: "Semi-skimmed milk",
          externalId: "food-milk",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "50",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "3.6",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "4.8",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "1.8",
            },
          ],
        },
      },
      {
        id: "entry-3",
        mealId: "meal-breakfast",
        amountInGrams: "120",
        servingId: null,
        servingQuantity: null,
        serving: null,
        food: {
          id: "food-banana",
          name: "Banana",
          externalId: "food-banana",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "89",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "1.1",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "22.8",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "0.3",
            },
          ],
        },
      },
    ],
  },
  {
    id: "meal-lunch",
    userId: "test-user",
    eatenAt: "2026-11-02T12:30:00.000Z",
    entries: [
      {
        id: "entry-4",
        mealId: "meal-lunch",
        amountInGrams: "150",
        servingId: null,
        servingQuantity: null,
        serving: null,
        food: {
          id: "food-chicken",
          name: "Chicken breast",
          externalId: "food-chicken",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "165",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "31",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "0",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "3.6",
            },
          ],
        },
      },
      {
        id: "entry-5",
        mealId: "meal-lunch",
        amountInGrams: "180",
        servingId: "serving-rice",
        servingQuantity: "1.5",
        serving: {
          id: "serving-rice",
          externalId: "100g-cooked",
          foodId: "food-rice",
          label: "120g cooked",
          amountInGrams: "120",
        },
        food: {
          id: "food-rice",
          name: "Cooked white rice",
          externalId: "food-rice",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "130",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "2.7",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "28.2",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "0.3",
            },
          ],
        },
      },
      {
        id: "entry-6",
        mealId: "meal-lunch",
        amountInGrams: "90",
        servingId: null,
        servingQuantity: null,
        serving: null,
        food: {
          id: "food-broccoli",
          name: "Broccoli",
          externalId: "food-broccoli",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "34",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "2.8",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "6.6",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "0.4",
            },
          ],
        },
      },
    ],
  },
  {
    id: "meal-dinner",
    userId: "test-user",
    eatenAt: "2026-11-02T18:30:00.000Z",
    entries: [
      {
        id: "entry-7",
        mealId: "meal-dinner",
        amountInGrams: "160",
        servingId: "serving-salmon",
        servingQuantity: "1",
        serving: {
          id: "serving-salmon",
          externalId: "fillet",
          foodId: "food-salmon",
          label: "1 fillet",
          amountInGrams: "160",
        },
        food: {
          id: "food-salmon",
          name: "Salmon",
          externalId: "food-salmon",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "208",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "20.4",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "0",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "13.4",
            },
          ],
        },
      },
      {
        id: "entry-8",
        mealId: "meal-dinner",
        amountInGrams: "200",
        servingId: null,
        servingQuantity: null,
        serving: null,
        food: {
          id: "food-potato",
          name: "Baked potato",
          externalId: "food-potato",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "93",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "2.5",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "21.2",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "0.1",
            },
          ],
        },
      },
      {
        id: "entry-9",
        mealId: "meal-dinner",
        amountInGrams: "100",
        servingId: "serving-carrots",
        servingQuantity: "1",
        serving: {
          id: "serving-carrots",
          externalId: "medium-carrot",
          foodId: "food-carrots",
          label: "1 medium carrot",
          amountInGrams: "100",
        },
        food: {
          id: "food-carrots",
          name: "Carrots",
          externalId: "food-carrots",
          externalSource: "test",
          nutrients: [
            {
              nutrient: { id: "n1", name: "Calories", unit: "kcal" },
              amountPer100g: "41",
            },
            {
              nutrient: { id: "n2", name: "Protein", unit: "g" },
              amountPer100g: "0.9",
            },
            {
              nutrient: {
                id: "n3",
                name: "Total carbohydrates",
                unit: "g",
              },
              amountPer100g: "9.6",
            },
            {
              nutrient: { id: "n4", name: "Total fat", unit: "g" },
              amountPer100g: "0.2",
            },
          ],
        },
      },
    ],
  },
];
