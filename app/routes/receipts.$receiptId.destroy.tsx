import { deleteOneReceiptById } from '@/data/api/ReceiptApi';
import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { getAuthenticatedClient } from '~/supabase.auth.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
	invariant(params.receiptId, 'Missing receiptId param');

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	await deleteOneReceiptById(supabaseClient, parseInt(params.receiptId));
	return redirect(`/receipts`);
};
