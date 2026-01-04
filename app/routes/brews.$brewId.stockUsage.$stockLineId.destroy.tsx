import { deleteStockUsage } from "@/data/api/StockUsageApi";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { getAuthenticatedClient } from "~/supabase.auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.brewId, "Missing brewId param");
  invariant(params.stockLineId, "Missing stockLineId param");

  const { supabaseClient, userId } = await getAuthenticatedClient(request);

  if (!userId) {
    return redirect("/sign-in");
  }

  await deleteStockUsage(supabaseClient, userId, {
    brew_id: parseInt(params.brewId),
    stock_line_id: parseInt(params.stockLineId),
  });
  return redirect(`/brews/${params.brewId}`);
};
