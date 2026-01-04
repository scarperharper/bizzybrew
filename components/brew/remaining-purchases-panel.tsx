import { currency } from "../data/tables/formatters/currency";
import { Link } from "react-router";
import { RemainingPurchase } from "@/data/models/StockPurchase";
import { getGroupColor } from "@/data/models/StockGroup";

export function RemainingPurchasesPanel({
  remainingPurchases,
}: {
  remainingPurchases: RemainingPurchase[];
}) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div>
        {remainingPurchases.map((purchase) => (
          <Link
            to={`/stock-line/${purchase.id}`}
            key={purchase.id}
            className="mb-8 flex flex-row w-full hover:scale-105 hover:bg-indigo-950 p-4 transition duration-800"
          >
            <div className="flex flex-col text-wrap">
              <strong className="text-slate-900 text-sm font-large dark:text-slate-200">
                {purchase.name}
              </strong>
              <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
                {purchase.remaining}
              </span>
              <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
                Value: {currency(purchase.value)}
              </span>
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className="rounded dark:ring-1 dark:ring-inset dark:ring-white/10 sm:w-full"
                style={{
                  width: `${(purchase.remaining / purchase.amount) * 90}%`,
                  backgroundColor: `${getGroupColor(purchase.group_name)}`,
                }}
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
