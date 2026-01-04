import { deleteOneProductById } from "@/data/api/ProductApi";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { getAuthenticatedClient } from "~/supabase.auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.brewId, "Missing brewId param");
  invariant(params.productId, "Missing productId param");

  const { supabaseClient, userId } = await getAuthenticatedClient(request);

  if (!userId) {
    return redirect("/sign-in");
  }

  await deleteOneProductById(supabaseClient, userId, parseInt(params.productId));
  return redirect(`/brews/${params.brewId}`);
};
