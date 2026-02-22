import { AddButton } from '@/components/data/util/buttons/add-button';
import { StockLinePanel } from '@/components/stockLine/stockLine-panel';
import {
	getStockLineSummary,
	insertOneStockLine,
} from '@/data/api/StockLineApi';
import { StockLine, StockLineSummary } from '@/data/models/StockLine';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { Form, NavLink, Outlet, redirect, useLoaderData } from 'react-router';
import { authContext } from '~/context';

export const action = async ({ context }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const stockLine = await insertOneStockLine(supabaseClient, userId, {
		name: 'New Stock Item',
		stock_group_id: 0,
	});
	return redirect(`/stock/${(stockLine.data as StockLine).id}/edit`);
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	return await getStockLineSummary(supabaseClient);
};

const StockPage = () => {
	const response = useLoaderData<typeof loader>();

	const stockLineSummaries = response.data as unknown as StockLineSummary[];

	return (
		<div className="flex flex-row flex-wrap py-4">
			<aside className="w-full sm:w-1/3 md:w-1/4 px-2 max-h-screen overflow-y-auto">
				<div className="sticky top-0 p-4 w-full">
					<div className="flex space-x-2 justify-between items-start">
						<div className="flex flex-col space-y-1.5 p-6">
							<h3 className="text-2xl font-semibold leading-none tracking-tight text-secondary">
								Stock
							</h3>
						</div>
						<div className="flex flex-col space-y-1.5 p-6">
							<Form method="post">
								<AddButton>Add</AddButton>
							</Form>
						</div>
					</div>
					<ul className="flex flex-col">
						{stockLineSummaries.map((stockLineSummary) => (
							<NavLink
								key={stockLineSummary.id}
								className={({ isActive, isPending }) =>
									`rounded border-solid border-2 ${
										isActive
											? 'border-secondary'
											: isPending
												? 'border-grey'
												: 'border-transparent'
									}`
								}
								to={`/stock-line/${stockLineSummary.id}`}
							>
								<li>
									<StockLinePanel
										stockLineSummary={stockLineSummary}
									/>
								</li>
							</NavLink>
						))}
					</ul>
				</div>
			</aside>
			<main role="main" className="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
				<Outlet />
			</main>
		</div>
	);
};
export default StockPage;
