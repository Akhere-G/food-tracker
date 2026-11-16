import { revalidatePath } from "next/cache";
import { toError } from "@/lib/action";
import { replaceMealRequest } from "@/app/features/meals/schemas";
import * as mealService from "@/app/features/meals/service";

const statusByCode = {
  validation: 422,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  external_api: 502,
  unknown: 500,
} as const;

export async function PUT(
  request: Request,
  context: RouteContext<"/api/meals/[mealId]">,
) {
  try {
    const { mealId } = await context.params;
    const input = replaceMealRequest.parse(await request.json());
    const result = await mealService.replaceMeal(mealId, input);
    revalidatePath("/meals");
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    const result = toError(error, "We could not update the meal.");
    return Response.json(result, { status: statusByCode[result.code] });
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/meals/[mealId]">,
) {
  try {
    const { mealId } = await context.params;
    await mealService.deleteMeal(mealId);
    revalidatePath("/meals");
    revalidatePath("/dashboard");
    return new Response(null, { status: 204 });
  } catch (error) {
    const result = toError(error, "We could not delete the meal.");
    return Response.json(result, { status: statusByCode[result.code] });
  }
}
