import { ApiResult } from "./ApiResult";
import {
  StockLine,
  StockLineSummary,
  StockLineTransaction,
} from "../models/StockLine";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getStockLineById(
  supabaseClient: SupabaseClient,
  userId: string,
  id: number
): Promise<ApiResult<StockLine>> {
  const result = await supabaseClient
    .from("stock_line")
    .select()
    .eq("id", id);

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

export async function insertOneStockLine(
  supabaseClient: SupabaseClient,
  userId: string,
  stockLine: Partial<StockLine>
): Promise<ApiResult<StockLine>> {
  const result = await supabaseClient
    .from("stock_line")
    .insert({
      name: stockLine.name,
      stock_group_id: stockLine.stock_group_id,
      stock_level: 0,
      last_update: new Date(),
      user_id: userId,
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

export async function updateOneStockLine(
  supabaseClient: SupabaseClient,
  userId: string,
  stockLine: StockLine
): Promise<ApiResult<StockLine>> {
  const result = await supabaseClient
    .from("stock_line")
    .update(stockLine)
    .eq("id", stockLine.id)
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

export async function deleteOneStockLineById(
  supabaseClient: SupabaseClient,
  userId: string,
  id: number
): Promise<ApiResult<StockLine>> {
  const result = await supabaseClient
    .from("stock_line")
    .delete()
    .eq("id", id)
    .select();

  if (result.status == 200)
    return {
      success: true,
      data: {} as StockLine,
    };

  return {
    success: false,
    error: result.error,
  };
}

export async function deleteOneStockLine(
  supabaseClient: SupabaseClient,
  userId: string,
  stockLine: StockLine
): Promise<ApiResult<StockLine>> {
  return await deleteOneStockLineById(supabaseClient, userId, stockLine.id!);
}

export async function getStockLineSummary(
  supabaseClient: SupabaseClient,
  userId: string,
  id?: number
): Promise<ApiResult<StockLineSummary[] | StockLineSummary>> {
  if (id) {
    const result = await supabaseClient
      .from("view_stock_summary")
      .select()
      .eq("id", id);

    if (result.status == 200)
      return {
        success: true,
        data: result.data?.pop() as StockLineSummary,
      };
    return {
      success: false,
      error: result.error,
    };
  } else {
    const result = await supabaseClient.from("view_stock_summary").select();
    if (result.status == 200)
      return {
        success: true,
        data: result.data as StockLineSummary[],
      };
    return {
      success: false,
      error: result.error,
    };
  }
}

export async function getStockLineTransactions(
  supabaseClient: SupabaseClient,
  userId: string,
  stockLineId: number
): Promise<StockLineTransaction[]> {
  const result = await supabaseClient
    .from("view_stock_line_transactions")
    .select()
    .eq("stock_line_id", stockLineId);

  return result.data || [];
}
