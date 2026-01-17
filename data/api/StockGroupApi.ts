import type { ApiResult } from './ApiResult';
import { StockGroup } from '../models/StockGroup';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getStockGroups(
	supabaseClient: SupabaseClient,
): Promise<ApiResult<StockGroup[]>> {
	const result = await supabaseClient
		.from('stock_group')
		.select()
		.order('group_order');

	if (result.data) {
		return {
			success: true,
			data: result.data,
		};
	}
	return {
		success: false,
		error: result.error,
	};
}
