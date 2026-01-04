import { LinkButton } from '@/components/data/util/buttons/link-button';
import { SalesSummaryPanel } from '@/components/sale/sales-summary-panel';
import { getSalesSummary } from '@/data/api/SaleApi';
import { SaleSummary } from '@/data/models/Sale';
import { type LoaderFunctionArgs, redirect, useLoaderData } from 'react-router';
import { getAuthenticatedClient } from '~/supabase.auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const salesSummaryResponse = await getSalesSummary(supabaseClient, userId);
	if (!salesSummaryResponse || salesSummaryResponse.error) {
		throw new Response('Not Found', { status: 404 });
	}
	return { salesSummaryResponse };
};

const SalesIndex = () => {
	const { salesSummaryResponse } = useLoaderData<typeof loader>();
	const salesSummary = salesSummaryResponse.data as unknown as SaleSummary[];
	return (
		<div className="flex-1 w-full flex flex-col gap-20 items-center">
			<div className="flex flex-row w-full">
				<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
					Sales
				</h1>
				<div className="ml-auto">
					<LinkButton href={`/sales/add`}>+ Add Sale</LinkButton>
				</div>
			</div>
			<SalesSummaryPanel salesSummary={salesSummary} showFilter={true} />;
		</div>
	);
};
export default SalesIndex;
