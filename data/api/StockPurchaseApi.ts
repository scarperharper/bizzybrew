import {
	RemainingPurchase,
	StockPurchase,
	StockPurchaseSummary,
} from '../models/StockPurchase';
import type { ApiResult } from './ApiResult';
import {
	type PostgrestSingleResponse,
	SupabaseClient,
} from '@supabase/supabase-js';

export async function getStockPurchaseById(
	supabaseClient: SupabaseClient,
	userId: string,
	id: number,
): Promise<StockPurchase> {
	const result = await supabaseClient
		.from('stock_purchase')
		.select()
		.eq('id', id);

	return result.data?.pop() || {};
}

export async function getPurchasesForReceiptId(
	supabaseClient: SupabaseClient,
	receiptId: number,
): Promise<ApiResult<StockPurchaseSummary[]>> {
	// TODO: fix schema so that stock_line and stock_group are objects, not arrays
	// https://postgrest.org/en/v12/references/api/resource_embedding.html#nested-embedding
	const result = (await supabaseClient
		.from('stock_purchase')
		.select(
			`
        id,
        receipt_id,
        stock_line_id,
        purchase_date,
        details,
        amount,
        cost,
        unit_cost,
        remaining,
        user_id,
        stock_line ( id, name, stock_group ( group_name ) ),
        stock_usage ( usage_date, amount, usage_cost, brew (id, name) )
        `,
		)
		.eq('receipt_id', receiptId)) as unknown as PostgrestSingleResponse<
		StockPurchaseSummary[]
	>;

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

export async function getRemainingPurchases(
	supabaseClient: SupabaseClient,
): Promise<ApiResult<RemainingPurchase[]>> {
	const result = await supabaseClient
		.from('view_remaining_purchases')
		.select();

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

export async function insertOneStockPurchase(
	supabaseClient: SupabaseClient,
	userId: string,
	stockPurchase: Partial<StockPurchase>,
): Promise<ApiResult<StockPurchase>> {
	const data: Partial<StockPurchase> = {
		stock_line_id: stockPurchase.stock_line_id,
		purchase_date: stockPurchase.purchase_date,
		details: stockPurchase.details,
		amount: stockPurchase.amount,
		cost: stockPurchase.cost,
		receipt_id: stockPurchase.receipt_id,
		remaining: stockPurchase.amount,
		user_id: userId,
	};

	const result = await supabaseClient
		.from('stock_purchase')
		.insert(data)
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

export async function updateOneStockPurchase(
	supabaseClient: SupabaseClient,
	userId: string,
	stockPurchase: StockPurchase,
): Promise<ApiResult<StockPurchase>> {
	const data: Partial<StockPurchase> = {
		stock_line_id: stockPurchase.stock_line_id,
		purchase_date: stockPurchase.purchase_date,
		details: stockPurchase.details,
		amount: stockPurchase.amount,
		cost: stockPurchase.cost,
		receipt_id: stockPurchase.receipt_id,
		remaining: stockPurchase.amount,
		user_id: userId,
	};

	const result = await supabaseClient
		.from('stock_purchase')
		.update(data)
		.eq('id', stockPurchase.id)
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

export async function deleteOneStockPurchase(
	supabaseClient: SupabaseClient,
	userId: string,
	stockPurchase: StockPurchase,
): Promise<ApiResult<StockPurchase>> {
	return await deleteOneStockPurchaseById(
		supabaseClient,
		userId,
		stockPurchase.id!,
	);
}

export async function deleteOneStockPurchaseById(
	supabaseClient: SupabaseClient,
	userId: string,
	id: number,
): Promise<ApiResult<StockPurchase>> {
	const result = await supabaseClient
		.from('stock_purchase')
		.delete()
		.eq('id', id)
		.select();

	if (result.status == 200)
		return {
			success: true,
			data: {} as StockPurchase,
		};

	return {
		success: false,
		error: result.error,
	};
}
