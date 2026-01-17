import { Currency } from '@/components/currency';
import { ColumnBuilder } from '@/components/data/tables/column-builder';
import { DataTable } from '@/components/data/tables/data-table';
import { LinkButton } from '@/components/data/util/buttons/link-button';
import { getSaleSummaryById } from '@/data/api/SaleApi';
import { SaleSummary } from '@/data/models/Sale';
import { SaleItemSummary } from '@/data/models/SaleItem';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { Outlet, useLoaderData, useSubmit } from 'react-router';
import { format } from 'date-fns';
import invariant from 'tiny-invariant';
import { getAuthenticatedClient } from '~/supabase.auth.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.saleId, 'Missing saleId param');
	const saleId: number = parseInt(params.saleId);

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [saleSummaryResponse] = await Promise.all([
		getSaleSummaryById(supabaseClient, saleId),
	]);

	if (!saleSummaryResponse || saleSummaryResponse.error) {
		throw new Response('Not Found', { status: 404 });
	}
	return { saleSummaryResponse };
};

const SalesIndex = () => {
	const { saleSummaryResponse } = useLoaderData<typeof loader>();
	const saleSummary = saleSummaryResponse.data as unknown as SaleSummary;
	const submit = useSubmit();

	const deleteSaleItem = (item: SaleItemSummary) => {
		submit(
			{},
			{
				action: `/sales/${saleSummary.id}/saleItem/${item.id}/destroy`,
				method: 'post',
			},
		);
	};

	const columns = new ColumnBuilder<SaleItemSummary>()
		.addTextColumn('quantity', 'Quantity')
		.addTextColumn('product>brew>name', 'Brew')
		.addTextColumn('product>product_type>name', 'Product')
		.addCurrencyColumn('unit_price', 'Unit Price')
		.addCurrencyColumn('total_price', 'Total Price')
		.withActionColumn({
			deleteEntity: deleteSaleItem,
		})
		.build();

	return (
		<>
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<div className="flex flex-row w-full">
					<div>
						<p className="mb-2 text-sm leading-6 font-semibold text-secondary dark:text-secondary">
							{format(saleSummary.created_at, 'PPP')}
						</p>
						<div className="flex items-center">
							<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
								{saleSummary.customer.name}
							</h1>
						</div>
						<p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
							Total amount:{' '}
							<Currency amount={saleSummary.total_amount} />
						</p>
					</div>

					<div className="ml-auto">
						<LinkButton href={`/sales/${saleSummary.id}/item/add`}>
							+ Add Line Item
						</LinkButton>
					</div>
				</div>

				<DataTable
					data={saleSummary.sale_item}
					columns={columns}
				></DataTable>
				<Outlet />
			</div>
		</>
	);
};
export default SalesIndex;
