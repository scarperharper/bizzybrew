/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'bizzybrew',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'aws',
		};
	},
	async run() {
		const DATABASE_URL = new sst.Secret('DATABASE_URL');
		const SUPABASE_ANON_KEY = new sst.Secret('SUPABASE_ANON_KEY');
		const SUPABASE_URL = new sst.Secret('SUPABASE_URL');
		new sst.aws.React('bizzybrew', {
			link: [SUPABASE_ANON_KEY, SUPABASE_URL, DATABASE_URL],
			domain: 'bizzybrew.com',
			environment: {
				DATABASE_URL: DATABASE_URL.value,
				SUPABASE_ANON_KEY: SUPABASE_ANON_KEY.value,
				SUPABASE_URL: SUPABASE_URL.value,
			},
		});
	},
});
