import { AddButton } from '@/components/data/util/buttons/add-button';
import { ReceiptPanel } from '@/components/receipt/receipt-panel';
import { getReceiptSummary, insertOneReceipt } from '@/data/api/ReceiptApi';
import { Receipt } from '@/data/models/Receipt';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { Form, NavLink, Outlet, redirect, useLoaderData } from 'react-router';
import { authContext } from '~/context';

export const action = async ({ context }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const receipt = await insertOneReceipt(supabaseClient, userId, {
		description: 'New Receipt',
		date: new Date(),
	});
	return redirect(`/receipts/${(receipt.data as Receipt).id}/edit`);
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	return await getReceiptSummary(supabaseClient);
};

const Receipts = () => {
	const response = useLoaderData<typeof loader>();

	const receipts = response.data as unknown as Receipt[];

	return (
		<div className="flex flex-row flex-wrap py-4">
			<aside className="w-full sm:w-1/3 md:w-1/4 px-2 max-h-screen overflow-y-auto">
				<div className="sticky top-0 p-4 w-full">
					<div className="flex space-x-2 justify-between items-start">
						<div className="flex flex-col space-y-1.5 p-6">
							<h3 className="text-2xl font-semibold leading-none tracking-tight text-secondary">
								Receipts
							</h3>
						</div>
						<div className="flex flex-col space-y-1.5 p-6">
							<Form method="post">
								<AddButton>Add</AddButton>
							</Form>
						</div>
					</div>
					<ul className="flex flex-col">
						{receipts.map((receipt) => (
							<NavLink
								key={receipt.id}
								className={({ isActive, isPending }) =>
									`rounded border-solid border-2 ${
										isActive
											? 'border-secondary'
											: isPending
												? 'border-grey'
												: 'border-transparent'
									}`
								}
								to={`/receipts/${receipt.id}`}
							>
								<li>
									<ReceiptPanel receipt={receipt} />
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
export default Receipts;
