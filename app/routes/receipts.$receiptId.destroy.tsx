import { deleteOneReceiptById } from '@/data/api/ReceiptApi';
import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { authContext } from '~/context';

export const action = async ({ params, context }: ActionFunctionArgs) => {
	invariant(params.receiptId, 'Missing receiptId param');

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	await deleteOneReceiptById(supabaseClient, parseInt(params.receiptId));
	return redirect(`/receipts`);
};
