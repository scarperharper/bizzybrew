import { deleteStockUsage } from '@/data/api/StockUsageApi';
import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { authContext } from '~/context';

export const action = async ({ params, context }: ActionFunctionArgs) => {
	invariant(params.brewId, 'Missing brewId param');
	invariant(params.stockLineId, 'Missing stockLineId param');

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	await deleteStockUsage(supabaseClient, {
		brew_id: parseInt(params.brewId),
		stock_line_id: parseInt(params.stockLineId),
	});
	return redirect(`/brews/${params.brewId}`);
};
