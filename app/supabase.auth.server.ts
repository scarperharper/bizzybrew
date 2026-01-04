import { createSupabaseServerClient } from "~/supabase.server";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuthResult {
  supabaseClient: SupabaseClient;
  userId: string | null;
  headers: Headers;
}

/**
 * Creates an authenticated Supabase client by checking auth once.
 * Use this at the route loader/action level to avoid repeated auth calls.
 *
 * @param request - The incoming request
 * @returns AuthResult with authenticated client and user ID
 */
export async function getAuthenticatedClient(
  request: Request
): Promise<AuthResult> {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return {
    supabaseClient,
    userId: user?.id ?? null,
    headers,
  };
}
