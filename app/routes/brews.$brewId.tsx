import { Currency } from '@/components/currency';
import { StockUsageChart } from '@/components/data/charts/stock-usage-chart';
import { StockUsageTable } from '@/components/data/tables/stock-usage/stock-usage-table';
import { EditButton } from '@/components/data/util/buttons/edit-button';
import { ProductSummaryPanel } from '@/components/product/product-summary-panel';
import { getBrewById } from '@/data/api/BrewApi';
import { getProductSummaryForBrew } from '@/data/api/ProductApi';
import { getStockUsageSummary } from '@/data/api/StockUsageApi';
import { Brew } from '@/data/models/Brew';
import { ProductSummary } from '@/data/models/Product';
import { StockUsageSummary } from '@/data/models/StockUsage';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { Outlet, useLoaderData } from 'react-router';
import { format } from 'date-fns';
import invariant from 'tiny-invariant';
import { getAuthenticatedClient } from '~/supabase.auth.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.brewId, 'Missing brewId param');
	const brewId: number = parseInt(params.brewId);

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	return Promise.all([
		getBrewById(supabaseClient, brewId),
		getStockUsageSummary(supabaseClient, brewId),
		getProductSummaryForBrew(supabaseClient, brewId),
	]);
};

export default function BrewDetail() {
	const [brewResult, stockUsageSummary, productSummary] =
		useLoaderData<typeof loader>();

	const brew = brewResult.data as unknown as Brew;

	return (
		<div>
			<header id="header" className="relative z-20 mb-8">
				<div className="flex space-x-2 justify-between items-start">
					<div className="flex flex-col">
						<div>
							<p className="mb-2 text-sm leading-6 font-semibold text-secondary dark:text-secondary">
								{format(brew.brew_date, 'PPP')}
							</p>
							<div className="flex items-center">
								<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
									{brew.name}
								</h1>
							</div>
						</div>
						{brew.duty ? (
							<p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
								Duty: <Currency amount={brew.duty} />
							</p>
						) : (
							''
						)}
						<p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
							Total cost: <Currency amount={brew.total_cost} />
						</p>
						<p className="mt-2 text-slate-700 dark:text-slate-400">
							Proceeds: <Currency amount={brew.income} />
						</p>
					</div>
					<div className="flex flex-col">
						<EditButton
							text="Edit"
							href={`/brews/${brew.id}/edit`}
						/>
					</div>
				</div>
			</header>

			<div className="flex flex-col gap-4">
				<div>
					<StockUsageTable
						stockUsageSummary={
							stockUsageSummary as unknown as StockUsageSummary[]
						}
						brew={brew}
					/>
				</div>
				<div>
					<StockUsageChart
						data={
							stockUsageSummary as unknown as StockUsageSummary[]
						}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<ProductSummaryPanel
					productSummary={
						productSummary.data as unknown as ProductSummary[]
					}
					brew={brew}
				/>
			</div>

			<Outlet />
		</div>
	);
}
