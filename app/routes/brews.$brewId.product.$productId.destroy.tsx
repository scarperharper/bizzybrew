import { deleteOneProductById } from '@/data/api/ProductApi';
import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import invariant from 'tiny-invariant';
import { authContext } from '~/context';

export const action = async ({ params, context }: ActionFunctionArgs) => {
	invariant(params.brewId, 'Missing brewId param');
	invariant(params.productId, 'Missing productId param');

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	await deleteOneProductById(supabaseClient, parseInt(params.productId));
	return redirect(`/brews/${params.brewId}`);
};
