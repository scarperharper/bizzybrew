import { Entity } from "./Entity";
import { ProductSummary } from "./Product";
import { SaleSummary } from "./Sale";

export class SaleItem extends Entity {
  created_at: Date;
  sale_id: number;
  product_id: number;
  unit_price: number;
  quantity: number;

  constructor(data: SaleItem) {
    super(data);
    this.created_at = data.created_at;
    this.sale_id = data.sale_id;
    this.product_id = data.product_id;
    this.unit_price = data.unit_price;
    this.quantity = data.quantity;
  }
}

export class SaleItemSummary extends SaleItem {
  product: ProductSummary;
  sale: SaleSummary;

  constructor(data: SaleItemSummary) {
    super(data);
    this.product = data.product;
    this.sale = data.sale;
  }
}
