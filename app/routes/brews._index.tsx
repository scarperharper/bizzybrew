import { RecentBrewsPanel } from '@/components/brew/recent-brews-panel';
import { getRecentBrews } from '@/data/api/BrewApi';
import { RecentBrew } from '@/data/models/Brew';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import { authContext } from '~/context';

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const recentBrewsResponse = await getRecentBrews(supabaseClient, userId);
	if (!recentBrewsResponse || recentBrewsResponse.error) {
		throw new Response('Not Found', { status: 404 });
	}
	return { recentBrewsResponse };
};

export default function BrewsIndex() {
	const { recentBrewsResponse } = useLoaderData<typeof loader>();
	const recentBrews = recentBrewsResponse.data as unknown as RecentBrew[];
	return (
		<div className="hidden flex-col md:flex">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<div className="flex items-center">
					<h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
						Recent Brews
					</h1>
				</div>
				<RecentBrewsPanel recentBrews={recentBrews} />
			</div>
		</div>
	);
}
