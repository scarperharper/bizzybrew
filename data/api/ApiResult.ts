import { PostgrestError } from "@supabase/supabase-js";

export type ApiResult<T> = {
  success: boolean;
  data?: T | T[];
  error?: PostgrestError | null;
};
