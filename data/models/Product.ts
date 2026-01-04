import { Brew } from "./Brew";
import { Entity } from "./Entity";
import { ProductType } from "./ProductType";
import { SaleItemSummary } from "./SaleItem";

export class Product extends Entity {
  brew_id: number;
  product_type_id: number;
  amount: number;
  remaining: number;
  list_price: number;
  total_sales: number;

  constructor(data: Product) {
    super(data);
    this.brew_id = data.brew_id;
    this.product_type_id = data.product_type_id;
    this.amount = data.amount;
    this.remaining = data.remaining;
    this.list_price = data.list_price;
    this.total_sales = data.total_sales;
  }
}

export class ProductSummary extends Product {
  brew: Brew;
  product_type: ProductType;
  sale_item: SaleItemSummary[];

  constructor(data: ProductSummary) {
    super(data);
    this.brew = data.brew;
    this.product_type = data.product_type;
    this.sale_item = data.sale_item;
  }
}
