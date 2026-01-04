import { format } from "date-fns";
import BizzybrewBubble from "../local/bizzybrew-bubble";
import { Receipt } from "@/data/models/Receipt";

export function ReceiptPanel({ receipt }: { receipt: Receipt }) {
    return (
        <div className="flex items-center gap-4 p-4 text-nowrap overflow-hidden">
            <div className="min-w-8 w-8 h-8">
                <BizzybrewBubble className="fill-secondary" />
            </div>
            <div className="flex flex-col text-wrap">
                <strong className="text-slate-900 text-sm font-medium dark:text-slate-200 overflow-hidden line-clamp-2">
                    {receipt.description}
                </strong>
                <span className="text-slate-500 text-sm font-medium dark:text-slate-400 overflow-hidden line-clamp-2">
                    {format(receipt.date, "PP")}
                </span>
            </div>
        </div>
    );
}
