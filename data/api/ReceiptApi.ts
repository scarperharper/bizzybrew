import { SupabaseClient } from "@supabase/supabase-js";
import { Receipt, ReceiptSummary } from "../models/Receipt";
import { ApiResult } from "./ApiResult";

export async function getReceiptSummary(
  supabaseClient: SupabaseClient,
  userId: string,
  limit: number = 100
): Promise<ApiResult<ReceiptSummary[]>> {
  const result = await supabaseClient
    .from("receipt")
    .select(`
      id,
      date,
      description,
      stock_purchase ( id, amount, cost, stock_line ( id, name, stock_group ( id, group_name ) ), amount, cost)
    `)
    .limit(limit)
    .order("date", { ascending: false });

  if (result.data) {
    return {
      success: true,
      data: result.data as unknown as ReceiptSummary[],
    };
  }
  return {
    success: false,
    error: result.error,
  };
}

export async function getReceiptById(
  supabaseClient: SupabaseClient,
  userId: string,
  id: number
): Promise<ApiResult<Receipt>> {
  const result = await supabaseClient.from("receipt").select().eq("id", id);

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

export async function insertOneReceipt(
  supabaseClient: SupabaseClient,
  userId: string,
  receipt: Partial<Receipt>
): Promise<ApiResult<Receipt>> {
  const result = await supabaseClient
    .from("receipt")
    .insert({ ...receipt, user_id: userId })
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

export async function updateOneReceipt(
  supabaseClient: SupabaseClient,
  userId: string,
  receipt: Partial<Receipt>
): Promise<ApiResult<Receipt>> {
  const data: Partial<Receipt> = {
    date: receipt.date,
    description: receipt.description,
  };

  const result = await supabaseClient
    .from("receipt")
    .update(data)
    .eq("id", receipt.id)
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

export async function deleteOneReceipt(
  supabaseClient: SupabaseClient,
  userId: string,
  receipt: Receipt
): Promise<ApiResult<Receipt>> {
  return deleteOneReceiptById(supabaseClient, userId, receipt.id);
}

export async function deleteOneReceiptById(
  supabaseClient: SupabaseClient,
  userId: string,
  receiptId: number
): Promise<ApiResult<Receipt>> {
  const result = await supabaseClient
    .from("receipt")
    .delete()
    .eq("id", receiptId)
    .select();

  if (result.status == 200)
    return {
      success: true,
      data: {} as Receipt,
    };

  return {
    success: false,
    error: result.error,
  };
}
