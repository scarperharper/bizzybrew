import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let instance: SupabaseClient;

export const createClient = () => {
	if (!instance) {
		instance = createBrowserClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		);
	}
	return instance;
};
