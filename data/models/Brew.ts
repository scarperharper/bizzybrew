import { Entity } from './Entity';

export class Brew extends Entity {
	name: string;
	brew_date: Date;
	total_cost: number;
	duty: number;
	income: number;
	image_url?: string;

	constructor(data: Brew) {
		super(data);
		this.name = data.name;
		this.brew_date = data.brew_date;
		this.total_cost = data.total_cost;
		this.duty = data.duty;
		this.income = data.income;
		this.image_url = data.image_url;
	}
}

export class RecentBrew extends Brew {
	view_recent_usage_summary: {
		group_name: string;
		sum_cost: number;
		image_url: string;
		sum_amount: number;
	}[];

	constructor(data: RecentBrew) {
		super(data);
		this.view_recent_usage_summary = data.view_recent_usage_summary;
	}
}
