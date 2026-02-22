import { createContext } from "react-router";
import type { AuthResult } from "~/supabase.auth.server";

export const authContext = createContext<AuthResult>();
