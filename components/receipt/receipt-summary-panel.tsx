import { format } from 'date-fns';
import { currency } from '../data/tables/formatters/currency';
import { Link } from 'react-router';
import { ReceiptSummary } from '@/data/models/Receipt';
import { getGroupColor } from '@/data/models/StockGroup';
import { Input } from '../ui/input';
import { useState } from 'react';

type TransformedReceiptSummary = {
	id: number;
	name: string;
	date: Date;
	stats: {
		maxCost: number;
		totalCost: number;
		maxAmount: number;
		totalAmount: number;
	};
	groups: {
		id: string;
		name: string;
		amount: number;
		cost: number;
		purchases: ReceiptSummary['stock_purchase'];
	}[];
};

export function ReceiptSummaryPanel({
	receiptSummary,
	showFilter,
}: {
	receiptSummary: ReceiptSummary[];
	showFilter: boolean;
}) {
	const [filter, setFilter] = useState('');
	const dataFilter = (data: TransformedReceiptSummary) => {
		return [
			data.name,
			...data.groups.flatMap((g) =>
				g.purchases.map((p) => p.stock_line.name),
			),
		].some((item) => item.toLowerCase().includes(filter.toLowerCase()));
	};

	const data = receiptSummary.map((summary) => ({
		id: summary.id,
		name: summary.description,
		date: summary.date,
		stats: summary.stock_purchase.reduce(
			(stats, purchase) => {
				stats.maxCost = Math.max(stats.maxCost, purchase.cost);
				stats.totalCost += purchase.cost;
				stats.maxCost = Math.max(stats.maxCost, purchase.cost);
				stats.totalAmount += purchase.amount;
				return stats;
			},
			{
				maxCost: 0,
				totalCost: 0,
				maxAmount: 0,
				totalAmount: 0,
			},
		),
		groups: summary.stock_purchase.reduce(
			(groups, purchase) => {
				const groupId = purchase.stock_line.stock_group.id;
				let groupIndex = groups.findIndex((s) => s.id == groupId);
				if (groupIndex == -1) {
					groups.push({
						id: purchase.stock_line.stock_group.id,
						name: purchase.stock_line.stock_group.group_name,
						amount: 0,
						cost: 0,
						purchases: [],
					});
					groupIndex = groups.length - 1;
				}

				groups[groupIndex].amount += purchase.amount;
				groups[groupIndex].cost += purchase.cost;
				groups[groupIndex].purchases.push(purchase);
				return groups;
			},
			[] as {
				id: string;
				name: string;
				amount: number;
				cost: number;
				purchases: ReceiptSummary['stock_purchase'];
			}[],
		),
	}));

	return (
		<div className="flex flex-col gap-4 p-4 w-full">
			{showFilter ? (
				<Input
					type="filter"
					placeholder="Filter..."
					className="w-full"
					onChange={(event) => {
						setFilter(event.target.value);
					}}
				/>
			) : (
				''
			)}
			{data.filter(dataFilter).map((receipt) => (
				<Link
					to={`/receipts/${receipt.id}`}
					key={receipt.id}
					className="mb-8 flex flex-row w-full hover:scale-105 hover:bg-indigo-950 p-4 transition duration-800"
				>
					<div className="flex flex-col text-wrap">
						<strong className="text-slate-900 text-sm font-large dark:text-slate-200">
							{receipt.name}
						</strong>
						<span className="text-slate-500 text-sm font-medium dark:text-slate-400">
							{format(receipt.date, 'PP')}
						</span>
						<span className="text-slate-500 text-sm font-medium dark:text-slate-400">
							Total Cost: {currency(receipt.stats.totalCost)}
						</span>
					</div>
					<div className="grow justify-self-stretch">
						<table className="table-auto w-80 justify-self-end max-w-64 ml-auto">
							<col width="30%" />
							<col width="70%" />
							{receipt.groups.map((group) => (
								<tr
									key={group.id}
									className="text-left leading-4"
								>
									<th className="text-xs font-mono">
										{group.name}
									</th>
									<td className="flex flex-row">
										<div
											className="rounded dark:ring-1 dark:ring-inset dark:ring-white/10 sm:w-full"
											style={{
												width: `${(group.cost / receipt.stats.maxCost) * 90}%`,
												backgroundColor: `${getGroupColor(group.name)}`,
											}}
											title={group.purchases
												.map((p) => p.stock_line.name)
												.join(', ')}
										>
											&nbsp;
										</div>
									</td>
								</tr>
							))}
						</table>
					</div>
				</Link>
			))}
		</div>
	);
}
