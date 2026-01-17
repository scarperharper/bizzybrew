import { SupabaseClient } from '@supabase/supabase-js';
import {
	StockUsage,
	StockUsageRequest,
	StockUsageSummary,
} from '../models/StockUsage';
import type { ApiResult } from './ApiResult';

export async function getStockUsageSummary(
	supabaseClient: SupabaseClient,
	brewId: number,
	id?: number,
): Promise<StockUsageSummary[] | StockUsageSummary> {
	if (id) {
		const result = await supabaseClient
			.from('view_usage_summary')
			.select()
			.eq('brew_id', brewId)
			.eq('id', id);

		return result.data?.pop() || {};
	}

	const result = await supabaseClient
		.from('view_usage_summary')
		.select()
		.eq('brew_id', brewId);

	return result.data || [];
}

export async function getStockUsageById(
	supabaseClient: SupabaseClient,
	id: number,
): Promise<ApiResult<StockUsage>> {
	const result = await supabaseClient
		.from('stock_usage')
		.select()
		.eq('id', id);

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

export async function insertOneStockUsage(
	supabaseClient: SupabaseClient,
	userId: string,
	stockUsage: Partial<StockUsage>,
): Promise<ApiResult<StockUsage>> {
	const result = await supabaseClient
		.from('stock_usage')
		.insert({ ...stockUsage, user_id: userId })
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

export async function addStockUsage(
	supabaseClient: SupabaseClient,
	userId: string,
	stockUsageRequest: StockUsageRequest,
): Promise<ApiResult<StockUsageRequest>> {
	const result = await supabaseClient.rpc('add_usage', {
		_amount: stockUsageRequest.amount,
		_brew_id: stockUsageRequest.brew_id,
		_stock_line_id: stockUsageRequest.stock_line_id,
		_usage_date: stockUsageRequest.usage_date,
		_user_id: userId,
	});

	if (result.status == 204) {
		return {
			success: true,
			data: stockUsageRequest,
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function deleteStockUsage(
	supabaseClient: SupabaseClient,
	stockUsage: Partial<StockUsageSummary>,
): Promise<ApiResult<Partial<StockUsageSummary>>> {
	const result = await supabaseClient.rpc('remove_usage', {
		_brew_id: stockUsage.brew_id,
		_stock_line_id: stockUsage.stock_line_id,
	});

	if (result.status == 204) {
		return {
			success: true,
			data: stockUsage,
		};
	}
	return {
		success: false,
		error: result.error,
	};
}
