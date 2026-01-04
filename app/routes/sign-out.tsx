import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  // check if user is logged in

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/");
  }
  // sign out
  await supabaseClient.auth.signOut();

  return redirect("/", {
    headers,
  });
};
