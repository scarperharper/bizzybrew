import { ProductSummary } from "@/data/models/Product";
import { Currency } from "../currency";
import { Link } from "react-router";

export function AvailableProductsPanel({
  availableProducts,
}: {
  availableProducts: ProductSummary[];
}) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <ul>
        {(availableProducts || []).map((item) => (
          <Link
            to={`/brews/${item.brew.id}`}
            key={item.id}
            className="mb-8 flex flex-row w-full hover:scale-105 hover:bg-indigo-950 p-4 transition duration-800"
          >
            <li key={item.id} className="flex flex-col w-full pb-4">
              <div className="flex flex-row">
                <div className="flex flex-col text-wrap">
                  <strong className="text-slate-900 text-sm font-medium dark:text-slate-200 overflow-hidden line-clamp-2">
                    {item.brew.name}, {item.product_type.name}
                  </strong>
                  <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
                    {item.remaining} remaining of {item.amount}
                  </span>
                  <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
                    List Price: <Currency amount={item.list_price} />
                  </span>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
