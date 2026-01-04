import { Entity } from "./Entity";
import { StockLine } from "./StockLine";
import { StockUsage } from "./StockUsage";

export class StockPurchase extends Entity {
  stock_line_id: number;
  purchase_date: Date;
  details: string;
  amount: number;
  cost: number;
  unit_cost: number;
  remaining: number;
  receipt_id: number;

  constructor(data: StockPurchase) {
    super(data);
    this.stock_line_id = data.stock_line_id;
    this.purchase_date = data.purchase_date;
    this.details = data.details;
    this.amount = data.amount;
    this.cost = data.cost;
    this.unit_cost = data.unit_cost;
    this.remaining = data.remaining;
    this.receipt_id = data.receipt_id;
  }
}

export class StockPurchaseSummary extends Entity {
  receipt_id: number;
  purchase_date: Date;
  details: string;
  amount: number;
  cost: number;
  unit_cost: number;
  remaining: number;
  stock_line?: Partial<StockLine>;
  stock_usage?: Partial<StockUsage>[];

  constructor(data: StockPurchaseSummary) {
    super(data);
    this.receipt_id = data.receipt_id;
    this.purchase_date = data.purchase_date;
    this.details = data.details;
    this.amount = data.amount;
    this.cost = data.cost;
    this.unit_cost = data.unit_cost;
    this.remaining = data.remaining;
  }
}

export class RemainingPurchase extends Entity {
  group_name: string;
  name: string;
  remaining: number;
  amount: number;
  value: number;
  stock_line?: StockLine;
  stock_usage?: StockUsage[];

  constructor(data: RemainingPurchase) {
    super(data);
    this.group_name = data.group_name;
    this.name = data.name;
    this.remaining = data.remaining;
    this.amount = data.amount;
    this.value = data.value;
  }
}
