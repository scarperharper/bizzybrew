import { Brew, RecentBrew } from '../models/Brew';
import type { ApiResult } from './ApiResult';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getBrews(
	supabaseClient: SupabaseClient,
): Promise<ApiResult<Brew[]>> {
	const result = await supabaseClient
		.from('brew')
		.select()
		.order('brew_date', { ascending: false });

	if (result.data) {
		return {
			success: true,
			data: await Promise.all(
				result.data.map(async (brew) => {
					let image_url;

					if (brew.image_url) {
						const { data } = await supabaseClient.storage
							.from('images')
							.createSignedUrl(brew.image_url, 3600);

						image_url = data?.signedUrl;
					}
					return {
						...brew,
						image_url,
					} as Brew;
				}),
			),
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function getBrewById(
	supabaseClient: SupabaseClient,
	id: number,
): Promise<ApiResult<Brew>> {
	const result = await supabaseClient
		.from('brew')
		.select()
		.eq('id', id)
		.single();

	let image_url;

	if (result.data.image_url) {
		const { data } = await supabaseClient.storage
			.from('images')
			.createSignedUrl(result.data.image_url, 3600);

		image_url = data?.signedUrl;
	}

	if (result.data) {
		return {
			success: true,
			data: {
				...result.data,
				image_url,
				brew_date: new Date(result.data.brew_date),
			},
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function insertOneBrew(
	supabaseClient: SupabaseClient,
	userId: string,
	brew: Partial<Brew>,
): Promise<ApiResult<Brew>> {
	const result = await supabaseClient
		.from('brew')
		.insert({
			name: brew.name,
			brew_date: brew.brew_date,
			total_cost: 0,
			duty: 0,
			user_id: userId,
			image_url: brew.image_url,
		})
		.select();
	if (result.data) {
		return {
			success: true,
			data: result.data.pop(),
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function updateOneBrew(
	supabaseClient: SupabaseClient,
	brew: Partial<Brew>,
): Promise<ApiResult<Brew>> {
	const result = await supabaseClient
		.from('brew')
		.update({
			name: brew.name,
			brew_date: brew.brew_date,
			duty: brew.duty,
			image_url: brew.image_url,
		})
		.eq('id', brew.id)
		.select();

	if (result.data) {
		return {
			success: true,
			data: result.data.pop(),
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function getRecentBrews(
	supabaseClient: SupabaseClient,
	userId: string,
	count: number = 10,
): Promise<ApiResult<RecentBrew[]>> {
	const result = await supabaseClient
		.from('brew')
		.select(
			`
      id,
      name,
      brew_date,
      total_cost,
      duty,
      user_id,
      view_recent_usage_summary ( group_name, sum_cost, sum_amount )
      `,
		)
		.order('brew_date', { ascending: false })
		.limit(count);

	if (result.data) {
		return {
			success: true,
			data: result.data as unknown as RecentBrew[],
		};
	}
	return {
		success: false,
		error: result.error,
	};
}
