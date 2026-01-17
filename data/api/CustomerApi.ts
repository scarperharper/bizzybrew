import { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResult } from './ApiResult';
import { Customer } from '../models/Customer';

export async function getCustomers(
	supabaseClient: SupabaseClient,
): Promise<ApiResult<Customer[]>> {
	const result = await supabaseClient.from('customer').select().order('name');

	if (result.data) {
		return {
			success: true,
			data: result.data as unknown as Customer[],
		};
	}
	return {
		success: false,
		error: result.error,
	};
}

export async function insertOneCustomer(
	supabaseClient: SupabaseClient,
	userId: string,
	customer: Partial<Customer>,
): Promise<ApiResult<Customer>> {
	const result = await supabaseClient
		.from('customer')
		.insert({ ...customer, user_id: userId })
		.select()
		.single();

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

export async function deleteOneCustomer(
	supabaseClient: SupabaseClient,
	userId: string,
	customer: Customer,
): Promise<ApiResult<Customer>> {
	return deleteOneCustomerById(supabaseClient, userId, customer.id);
}

export async function deleteOneCustomerById(
	supabaseClient: SupabaseClient,
	userId: string,
	customerId: number,
): Promise<ApiResult<Customer>> {
	const result = await supabaseClient
		.from('customer')
		.delete()
		.eq('id', customerId)
		.select();

	if (result.status == 200)
		return {
			success: true,
			data: {} as Customer,
		};

	return {
		success: false,
		error: result.error,
	};
}
