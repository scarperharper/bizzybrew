import { RemainingPurchasesPanel } from '@/components/brew/remaining-purchases-panel';
import { getRemainingPurchases } from '@/data/api/StockPurchaseApi';
import { RemainingPurchase } from '@/data/models/StockPurchase';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import { authContext } from '~/context';

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const remainingPurchasesResponse =
		await getRemainingPurchases(supabaseClient);

	if (!remainingPurchasesResponse || remainingPurchasesResponse.error) {
		throw new Response('Error getting remaining purchases', {
			status: 404,
		});
	}
	return { remainingPurchasesResponse };
};

const StockLineIndex = () => {
	const { remainingPurchasesResponse } = useLoaderData<typeof loader>();
	const remainingPurchases =
		remainingPurchasesResponse.data as unknown as RemainingPurchase[];
	return (
		<div className="hidden flex-col md:flex">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<div className="flex items-center">
					<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
						Remaining Purchases
					</h1>
				</div>
				<RemainingPurchasesPanel
					remainingPurchases={remainingPurchases}
				/>
			</div>
		</div>
	);
};
export default StockLineIndex;
