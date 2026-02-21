import { Brew } from '@/data/models/Brew';
import { format } from 'date-fns';
import BizzybrewBubble from '../local/bizzybrew-bubble';

export function BrewPanel({ brew }: { brew: Brew }) {
	return (
		<div className="flex items-center gap-4 p-4 text-nowrap overflow-hidden">
			<div className="min-w-8 w-8 h-8">
				{brew.image_url ? (
					<img src={brew.image_url} alt="" className="h-8 w-8" />
				) : (
					<BizzybrewBubble className="fill-secondary" />
				)}
			</div>
			<div className="flex flex-col text-wrap">
				<strong className="text-slate-900 text-sm font-medium dark:text-slate-200 overflow-hidden line-clamp-2">
					{brew.name}
				</strong>
				<span className="text-slate-500 text-sm font-medium dark:text-slate-400 overflow-hidden line-clamp-2">
					{format(brew.brew_date, 'PP')}
				</span>
			</div>
		</div>
	);
}
