import { SupabaseClient } from "@supabase/supabase-js";
import { ApiResult } from "./ApiResult";
import { Product, ProductSummary } from "../models/Product";
import { ProductType } from "../models/ProductType";

export async function getProductSummaryForBrew(
  supabaseClient: SupabaseClient,
  userId: string,
  brewId: number,
  limit: number = 100
): Promise<ApiResult<ProductSummary[]>> {
  const result = await supabaseClient
    .from("product")
    .select(
      `
      id,
      brew ( id, name ),
      product_type ( id, name ),
      amount,
      remaining,
      list_price,
      total_sales,
      sale_item (
        id,
        sale (id,
          customer (id, name)
        ),
        unit_price,
        quantity,
        created_at
      )
    `
    )
    .eq("brew_id", brewId)
    .limit(limit);

  if (result.data) {
    return {
      success: true,
      data: result.data as unknown as ProductSummary[],
    };
  }
  return {
    success: false,
    error: result.error,
  };
}

export async function insertOneProduct(
  supabaseClient: SupabaseClient,
  userId: string,
  product: Partial<Product>
): Promise<ApiResult<Product>> {
  delete product.id;

  const result = await supabaseClient
    .from("product")
    .insert({ ...product, user_id: userId })
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

export async function updateOneProduct(
  supabaseClient: SupabaseClient,
  userId: string,
  product: Partial<Product>
): Promise<ApiResult<Product>> {
  const result = await supabaseClient
    .from("product")
    .update(product)
    .eq("id", product.id)
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

export async function getProductById(
  supabaseClient: SupabaseClient,
  userId: string,
  productId: number
): Promise<ApiResult<Product>> {
  const result = await supabaseClient
    .from("product")
    .select()
    .eq("id", productId);

  if (result.status == 200)
    return {
      success: true,
      data: result.data?.pop() as Product,
    };

  return {
    success: false,
    error: result.error,
  };
}

export async function deleteOneProduct(
  supabaseClient: SupabaseClient,
  userId: string,
  product: Product
): Promise<ApiResult<Product>> {
  return deleteOneProductById(supabaseClient, userId, product.id);
}

export async function deleteOneProductById(
  supabaseClient: SupabaseClient,
  userId: string,
  productId: number
): Promise<ApiResult<Product>> {
  const result = await supabaseClient
    .from("product")
    .delete()
    .eq("id", productId)
    .select();

  if (result.status == 200)
    return {
      success: true,
      data: {} as Product,
    };

  return {
    success: false,
    error: result.error,
  };
}

export async function getProductTypes(
  supabaseClient: SupabaseClient,
  userId: string
): Promise<ApiResult<ProductType[]>> {
  const result = await supabaseClient
    .from("product_type")
    .select()
    .order("name");

  if (result.data) {
    return {
      success: true,
      data: result.data as unknown as ProductType[],
    };
  }
  return {
    success: false,
    error: result.error,
  };
}

export async function getAvailableProducts(
  supabaseClient: SupabaseClient,
  userId: string
): Promise<ApiResult<ProductSummary[]>> {
  const result = await supabaseClient
    .from("product")
    .select(
      `
      id,
      amount,
      remaining,
      list_price,
      brew (id, name),
      product_type (id, name)
    `
    )
    .gt("remaining", 0)
    .order("brew(name)");

  if (result.data) {
    return {
      success: true,
      data: result.data as unknown as ProductSummary[],
    };
  }
  return {
    success: false,
    error: result.error,
  };
}
