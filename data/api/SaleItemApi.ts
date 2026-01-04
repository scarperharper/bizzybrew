import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResult } from "./ApiResult";
import { SaleItem } from "../models/SaleItem";

export async function insertOneSaleItem(
  supabaseClient: SupabaseClient,
  userId: string,
  sale_item: Partial<SaleItem>
): Promise<ApiResult<SaleItem>> {
  const result = await supabaseClient
    .from("sale_item")
    .insert({ ...sale_item, user_id: userId })
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

export async function deleteOneSaleItem(
  supabaseClient: SupabaseClient,
  userId: string,
  sale_item: SaleItem
): Promise<ApiResult<SaleItem>> {
  return deleteOneSaleItemById(supabaseClient, userId, sale_item.id);
}

export async function deleteOneSaleItemById(
  supabaseClient: SupabaseClient,
  userId: string,
  saleItemId: number
): Promise<ApiResult<SaleItem>> {
  const result = await supabaseClient
    .from("sale_item")
    .delete()
    .eq("id", saleItemId)
    .select();

  if (result.status == 200)
    return {
      success: true,
      data: {} as SaleItem,
    };

  return {
    success: false,
    error: result.error,
  };
}
