import { Brew } from "./Brew";
import { Entity } from "./Entity";

export class StockUsage extends Entity {
  brew_id: number;
  stock_purchase_id: number;
  usage_date: Date;
  amount: number;
  usage_cost: number;
  brew?: Partial<Brew>;

  constructor(data: StockUsage) {
    super(data);
    this.brew_id = data.brew_id;
    this.stock_purchase_id = data.stock_purchase_id;
    this.usage_date = data.usage_date;
    this.amount = data.amount;
    this.usage_cost = data.usage_cost;
  }
}

export class StockUsageSummary extends StockUsage {
  group_name: string;
  name: string;
  sum_amount: number;
  sum_cost: number;
  stock_line_id: number;

  constructor(data: StockUsageSummary) {
    super(data);
    this.group_name = data.group_name;
    this.name = data.name;
    this.sum_amount = data.sum_amount;
    this.sum_cost = data.sum_cost;
    this.stock_line_id = data.stock_line_id;
  }
}

export class StockUsageRequest {
  brew_id: number;
  stock_line_id: number;
  usage_date: Date;
  amount: number;

  constructor(data: StockUsageRequest) {
    this.brew_id = data.brew_id;
    this.stock_line_id = data.stock_line_id;
    this.usage_date = data.usage_date;
    this.amount = data.amount;
  }
}
