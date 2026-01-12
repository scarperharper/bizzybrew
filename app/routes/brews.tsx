import { BrewPanel } from '@/components/brew/brew-panel';
import { AddButton } from '@/components/data/util/buttons/add-button';
import { getBrews, insertOneBrew } from '@/data/api/BrewApi';
import { Brew } from '@/data/models/Brew';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { Form, NavLink, Outlet, redirect, useLoaderData } from 'react-router';
import { getAuthenticatedClient } from '~/supabase.auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const brew = await insertOneBrew(supabaseClient, {
		name: 'New Brew',
		brew_date: new Date(),
	});
	return redirect(`/brews/${(brew.data as Brew).id}/edit`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	return await getBrews(supabaseClient);
};

const Brews = () => {
	const response = useLoaderData<typeof loader>();

	const brews = response.data as unknown as Brew[];

	return (
		<div className="flex flex-row flex-wrap py-4">
			<aside className="w-full sm:w-1/3 md:w-1/4 px-2 max-h-screen overflow-y-auto">
				<div className="sticky top-0 p-4 w-full">
					<div className="flex space-x-2 justify-between items-start">
						<div className="flex flex-col space-y-1.5 p-6">
							<h3 className="text-2xl font-semibold leading-none tracking-tight text-secondary">
								Brews
							</h3>
						</div>
						<div className="flex flex-col space-y-1.5 p-6">
							<Form method="post">
								<AddButton>Add</AddButton>
							</Form>
						</div>
					</div>
					<ul className="flex flex-col">
						{brews.map((brew) => (
							<NavLink
								key={brew.id}
								className={({ isActive, isPending }) =>
									`rounded border-solid border-2 ${
										isActive
											? 'border-secondary'
											: isPending
											? 'border-grey'
											: 'border-transparent'
									}`
								}
								to={`/brews/${brew.id}`}
							>
								<li>
									<BrewPanel brew={brew} />
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
export default Brews;
