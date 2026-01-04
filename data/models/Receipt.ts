import { Entity } from "./Entity";

export class Receipt extends Entity {
	date: Date;
	description: string;

	constructor(data: Receipt) {
		super(data);
		this.date = data.date;
		this.description = data.description;
	}
}

export class ReceiptSummary extends Receipt {
	stock_purchase: {
		amount: number;
		cost: number;
		stock_line: {
			id: string;
			name: string;
			stock_group: {
				id: string;
				group_name: string
			}
		}
	}[]

	constructor(data: ReceiptSummary) {
		super(data);
		this.stock_purchase = data.stock_purchase;
	}
}