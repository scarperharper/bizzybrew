import { StockPurchaseTable } from '@/components/data/tables/stock-purchase/stock-purchase-table';
import { StockPurchaseUsageTree } from '@/components/data/tables/stock-purchase/stock-purchase-usage-table';
import { EditButton } from '@/components/data/util/buttons/edit-button';
import { SubmitButton } from '@/components/data/util/buttons/submit-button';
import { getReceiptById } from '@/data/api/ReceiptApi';
import { getPurchasesForReceiptId } from '@/data/api/StockPurchaseApi';
import { Receipt } from '@/data/models/Receipt';
import { StockPurchaseSummary } from '@/data/models/StockPurchase';
import {
	type LoaderFunctionArgs,
	redirect,
	Form,
	Outlet,
	useLoaderData,
} from 'react-router';
import { format } from 'date-fns';
import invariant from 'tiny-invariant';
import { authContext } from '~/context';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.receiptId, 'Missing receiptId param');
	const receiptId: number = parseInt(params.receiptId);

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [receiptResult, purchasesForReceiptIdResult] = await Promise.all([
		getReceiptById(supabaseClient, receiptId),
		getPurchasesForReceiptId(supabaseClient, receiptId),
	]);

	return { receiptResult, purchasesForReceiptIdResult };
};

export default function ReceiptDetail() {
	const { receiptResult, purchasesForReceiptIdResult } =
		useLoaderData<typeof loader>();

	const receipt = receiptResult.data as unknown as Receipt;
	const stockPurchases =
		purchasesForReceiptIdResult.data as unknown as StockPurchaseSummary[];

	return (
		<div>
			<header id="header" className="relative z-20 mb-8">
				<div className="flex space-x-2 justify-between items-start">
					<div className="flex flex-col">
						<div>
							<p className="mb-2 text-sm leading-6 font-semibold text-secondary dark:text-secondary">
								{format(receipt.date, 'PPP')}
							</p>
							<div className="flex items-center">
								<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
									{receipt.description}
								</h1>
							</div>
						</div>
						{/* <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
                            Total cost: <Currency amount={receipt.} />
                        </p> */}
					</div>
					<div className="flex flex-row space-x-2">
						<EditButton
							text="Edit"
							href={`/receipts/${receipt.id}/edit`}
						/>

						<Form
							action="destroy"
							method="post"
							onSubmit={(event) => {
								const response = confirm(
									'Please confirm you want to delete this record.',
								);
								if (!response) {
									event.preventDefault();
								}
							}}
						>
							<SubmitButton>
								<svg
									stroke="currentColor"
									fill="currentColor"
									strokeWidth="0"
									viewBox="0 0 448 512"
									className="mr-2 h-4 w-4"
									height="1em"
									width="1em"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
								</svg>
								Delete
							</SubmitButton>
						</Form>
					</div>
				</div>
			</header>

			<div className="flex flex-col gap-4">
				<div>
					<StockPurchaseTable
						stockPurchases={stockPurchases}
						receipt={receipt}
					/>
				</div>
				<div className="min-h-[500px]">
					<StockPurchaseUsageTree stockPurchases={stockPurchases} />
				</div>
			</div>

			<Outlet />
		</div>
	);
}
