import { deleteOneStockPurchaseById } from "@/data/api/StockPurchaseApi";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { authContext } from "~/context";

export const action = async ({ params, context }: ActionFunctionArgs) => {
  invariant(params.stockPurchaseId, "Missing stockPurchaseId param");

  const { supabaseClient, userId } = context.get(authContext);

  if (!userId) {
    return redirect("/sign-in");
  }

  await deleteOneStockPurchaseById(supabaseClient, userId, parseInt(params.stockPurchaseId));
  return redirect(`/receipts/${params.receiptId}`);
};
