import { deleteOneStockPurchaseById } from "@/data/api/StockPurchaseApi";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { getAuthenticatedClient } from "~/supabase.auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.stockPurchaseId, "Missing stockPurchaseId param");

  const { supabaseClient, userId } = await getAuthenticatedClient(request);

  if (!userId) {
    return redirect("/sign-in");
  }

  await deleteOneStockPurchaseById(supabaseClient, userId, parseInt(params.stockPurchaseId));
  return redirect(`/receipts/${params.receiptId}`);
};
