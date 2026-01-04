import { Customer } from "./Customer";
import { Entity } from "./Entity";
import { SaleItemSummary } from "./SaleItem";

export class Sale extends Entity {
  created_at: Date;
  customer_id: number;
  total_amount: number;

  constructor(data: Sale) {
    super(data);
    this.created_at = data.created_at;
    this.customer_id = data.customer_id;
    this.total_amount = data.total_amount;
  }
}

export class SaleSummary extends Sale {
  customer: Customer;
  sale_item: SaleItemSummary[];

  constructor(data: SaleSummary) {
    super(data);
    this.customer = data.customer;
    this.sale_item = data.sale_item;
  }
}
