import { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResult } from './ApiResult';
import { Sale, SaleSummary } from '../models/Sale';

export async function getSalesSummary(
	supabaseClient: SupabaseClient,
	id?: number,
): Promise<ApiResult<SaleSummary | SaleSummary[]>> {
	let builder = supabaseClient.from('sale').select(
		`
      id,
      created_at,
      customer (id, name),
      total_amount,
      sale_item (
        id,
        product (
          id,
          product_type ( id, name ),
          brew (id, name)
        ),
        unit_price,
        quantity,
        total_price
      )

    `,
	);

	if (id) {
		builder = builder.eq('id', id);
	} else {
		builder = builder.order('created_at', { ascending: false });
	}

	const result = await builder;

	if (result.data) {
		if (id) {
			return {
				success: true,
				data: result.data.pop() as unknown as SaleSummary,
			};
		}
		return {
			success: true,
			data: result.data as unknown as SaleSummary[],
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function getSaleSummaryById(
	supabaseClient: SupabaseClient,
	id: number,
): Promise<ApiResult<SaleSummary>> {
	return getSalesSummary(supabaseClient, id) as Promise<
		ApiResult<SaleSummary>
	>;
}

export async function insertOneSale(
	supabaseClient: SupabaseClient,
	userId: string,
	sale: Partial<Sale>,
): Promise<ApiResult<Sale>> {
	const result = await supabaseClient
		.from('sale')
		.insert({ ...sale, user_id: userId })
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

export async function deleteOneSale(
	supabaseClient: SupabaseClient,
	userId: string,
	sale: Sale,
): Promise<ApiResult<Sale>> {
	return deleteOneSaleById(supabaseClient, userId, sale.id);
}

export async function deleteOneSaleById(
	supabaseClient: SupabaseClient,
	userId: string,
	saleId: number,
): Promise<ApiResult<Sale>> {
	const result = await supabaseClient
		.from('sale')
		.delete()
		.eq('id', saleId)
		.select();

	if (result.status == 200)
		return {
			success: true,
			data: {} as Sale,
		};

	return {
		success: false,
		error: result.error,
	};
}
