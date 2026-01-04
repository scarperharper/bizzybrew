import { Entity } from "./Entity";

export class StockLine extends Entity {
  stock_group_id!: number;
  name!: string;
  stock_level!: number;
  last_update!: Date;

  constructor(data: StockLine) {
    super(data);
  }
}

export class StockLineSummary extends StockLine {
  group_name!: string;

  constructor(data: StockLineSummary) {
    super(data);
  }
}

export class StockLineTransaction extends Entity {
  transaction_date: Date;
  purchased: number;
  used: number;
  receipt_id: number;
  receipt_name: string;
  brew_id: number;
  brew_name: string;
  running_total: number;

  constructor(data: StockLineTransaction) {
    super(data);
    this.transaction_date = data.transaction_date;
    this.purchased = data.purchased;
    this.used = data.used;
    this.receipt_id = data.receipt_id;
    this.receipt_name = data.receipt_name;
    this.brew_id = data.brew_id;
    this.brew_name = data.brew_name;
    this.running_total = data.running_total;
  }
}
