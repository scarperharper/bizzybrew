import { StockLineTransactionChart } from '@/components/data/tables/stock-line/stock-line-transaction-chart';
import { StockLineTransactionTable } from '@/components/data/tables/stock-line/stock-line-transactions-table';
import { EditButton } from '@/components/data/util/buttons/edit-button';
import {
	getStockLineSummary,
	getStockLineTransactions,
} from '@/data/api/StockLineApi';
import {
	StockLineSummary,
	StockLineTransaction,
} from '@/data/models/StockLine';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { Outlet, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';
import { authContext } from '~/context';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.stockLineId, 'Missing stockLineId param');
	const stockLineId: number = parseInt(params.stockLineId);

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [stockLineSummaryResult, stockLineTransactionsResult] =
		await Promise.all([
			getStockLineSummary(supabaseClient, stockLineId),
			getStockLineTransactions(supabaseClient, stockLineId),
		]);

	return { stockLineSummaryResult, stockLineTransactionsResult };
};

export default function StockLineDetail() {
	const { stockLineSummaryResult, stockLineTransactionsResult } =
		useLoaderData<typeof loader>();

	const stockLineSummary =
		stockLineSummaryResult.data as unknown as StockLineSummary;
	const stockLineTransactions =
		stockLineTransactionsResult as unknown as StockLineTransaction[];

	return (
		<div>
			<header id="header" className="relative z-20 mb-8">
				<div className="flex space-x-2 justify-between items-start">
					<div className="flex flex-col">
						<div>
							<p className="mb-2 text-sm leading-6 font-semibold text-secondary dark:text-secondary">
								{stockLineSummary.group_name}
							</p>
							<div className="flex items-center">
								<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
									{stockLineSummary.name}
								</h1>
							</div>
						</div>
						<p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
							Remaining amount {stockLineSummary.stock_level}
						</p>
					</div>
					<div className="flex flex-col">
						<EditButton
							text="Edit"
							href={`/stock-line/${stockLineSummary.id}/edit`}
						/>
					</div>
				</div>
			</header>

			<div className="flex flex-col gap-4">
				<div>
					<StockLineTransactionChart
						stockLineTransactions={stockLineTransactions}
					/>
				</div>
				<div>
					<StockLineTransactionTable
						stockLineTransactions={stockLineTransactions}
					/>
				</div>
			</div>

			<Outlet />
		</div>
	);
}
