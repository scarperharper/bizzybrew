import { ReceiptSummaryPanel } from '@/components/receipt/receipt-summary-panel';
import { getReceiptSummary } from '@/data/api/ReceiptApi';
import { ReceiptSummary } from '@/data/models/Receipt';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import { authContext } from '~/context';

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const receiptSummaryResponse = await getReceiptSummary(supabaseClient);
	if (!receiptSummaryResponse || receiptSummaryResponse.error) {
		throw new Response('Not Found', { status: 404 });
	}
	return { receiptSummaryResponse };
};

const ReceiptsIndex = () => {
	const { receiptSummaryResponse } = useLoaderData<typeof loader>();
	const receiptSummary =
		receiptSummaryResponse.data as unknown as ReceiptSummary[];
	return (
		<div className="hidden flex-col md:flex">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<div className="flex items-center">
					<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
						Receipts
					</h1>
				</div>
				<ReceiptSummaryPanel
					receiptSummary={receiptSummary}
					showFilter={true}
				/>
			</div>
		</div>
	);
};
export default ReceiptsIndex;
