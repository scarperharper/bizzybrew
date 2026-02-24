import { RecentBrewsPanel } from '@/components/brew/recent-brews-panel';
import { getRecentBrews } from '@/data/api/BrewApi';
import { RecentBrew } from '@/data/models/Brew';
import { authContext } from '~/context';
import type { Route } from './+types/brews._index';
import { NavLink, redirect, useLoaderData } from 'react-router';

export const loader = async ({ context, request }: Route.LoaderArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	const url = new URL(request.url);

	const [offsetParam, limitParam] = [
		url.searchParams.get('offset'),
		url.searchParams.get('from'),
	];

	const [offset, limit] = [
		offsetParam ? parseInt(offsetParam) : undefined,
		limitParam ? parseInt(limitParam) : undefined,
	];

	if (!userId) {
		return redirect('/sign-in');
	}

	const recentBrewsResponse = await getRecentBrews({
		supabaseClient,
		offset,
		limit,
	});
	if (!recentBrewsResponse || recentBrewsResponse.error) {
		throw new Response('Not Found', { status: 404 });
	}
	return { recentBrewsResponse };
};

export default function BrewsIndex() {
	const {
		recentBrewsResponse: { data, offset, limit },
	} = useLoaderData<typeof loader>();
	const recentBrews = data as RecentBrew[];
	return (
		<div className="hidden flex-col md:flex">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<div className="flex items-center">
					<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
						Recent Brews
					</h1>
				</div>
				<RecentBrewsPanel recentBrews={recentBrews} />
				<div className="flex space-x-4">
					{offset ? (
						<NavLink to={`?offset=${offset - (limit || 0)}`}>
							&lt; Prev
						</NavLink>
					) : undefined}

					{limit === data?.length ? (
						<NavLink to={`?offset=${(offset || 0) + (limit || 0)}`}>
							Next &gt;
						</NavLink>
					) : undefined}
				</div>
			</div>
		</div>
	);
}
