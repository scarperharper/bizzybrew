import { RecentBrew } from "@/data/models/Brew";
import { format } from "date-fns";
import { currency } from "../data/tables/formatters/currency";
import { Link } from "react-router";
import { getGroupColor } from "@/data/models/StockGroup";

export function RecentBrewsPanel({
  recentBrews,
}: {
  recentBrews: RecentBrew[];
}) {
  const maxCost = recentBrews.reduce((p, c) => Math.max(p, c.total_cost), 0);

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div>
        {recentBrews.map((brew) => (
          <Link
            to={`/brews/${brew.id}`}
            key={brew.id}
            className="mb-8 flex flex-row w-full hover:scale-105 hover:bg-indigo-950 p-4 transition duration-800"
          >
            <div className="flex flex-col text-wrap">
              <strong className="text-slate-900 text-sm font-large dark:text-slate-200">
                {brew.name}
              </strong>
              <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
                {format(brew.brew_date, "PP")}
              </span>
              <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
                Total Cost: {currency(brew.total_cost)}
              </span>
            </div>
            <div className="flex-1 flex justify-end">
              {brew.view_recent_usage_summary.map((s) => (
                <div
                  key={s.group_name}
                  className="rounded dark:ring-1 dark:ring-inset dark:ring-white/10 sm:w-full"
                  style={{
                    width: `${(s.sum_cost / maxCost) * 90}%`,
                    backgroundColor: `${getGroupColor(s.group_name)}`,
                  }}
                  title={`${s.group_name} (${currency(s.sum_cost)})`}
                ></div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
