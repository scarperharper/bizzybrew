import BizzybrewBubble from "../local/bizzybrew-bubble";
import { StockLineSummary } from "@/data/models/StockLine";

export function StockLinePanel({ stockLineSummary }: { stockLineSummary: StockLineSummary }) {
    return (
        <div className="flex items-center gap-4 p-4 text-nowrap overflow-hidden">
            <div className="min-w-8 w-8 h-8">
                <BizzybrewBubble className="fill-secondary" />
            </div>
            <div className="flex flex-col text-wrap">
                <span className="text-slate-500 text-xs font-medium dark:text-slate-400 uppercase">
                    {stockLineSummary.group_name}
                </span>
                <strong className="text-slate-900 ont-medium dark:text-slate-200 overflow-hidden line-clamp-2">
                    {stockLineSummary.name}
                </strong>
                <span className="text-slate-500 text-sm font-medium dark:text-slate-400 overflow-hidden line-clamp-2">
                    {stockLineSummary.stock_level} available
                </span>
            </div>
        </div>
    );
}
