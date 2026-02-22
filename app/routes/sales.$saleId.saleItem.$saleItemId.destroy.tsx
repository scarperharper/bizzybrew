import { deleteOneSaleItemById } from "@/data/api/SaleItemApi";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { authContext } from "~/context";

export const action = async ({ params, context }: ActionFunctionArgs) => {
  invariant(params.saleId, "Missing saleId param");
  invariant(params.saleItemId, "Missing saleItemId param");

  const { supabaseClient, userId } = context.get(authContext);

  if (!userId) {
    return redirect("/sign-in");
  }

  await deleteOneSaleItemById(supabaseClient, userId, parseInt(params.saleItemId));
  return redirect(`/sales/${params.saleId}`);
};
