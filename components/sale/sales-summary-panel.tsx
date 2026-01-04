import { format } from "date-fns";
import { currency } from "../data/tables/formatters/currency";
import { Link } from "react-router";
import { SaleSummary } from "@/data/models/Sale";
import { Input } from "../ui/input";
import { useState } from "react";
import { getProductColor } from "@/data/models/ProductType";

export function SalesSummaryPanel({
  salesSummary,
  showFilter,
}: {
  salesSummary: SaleSummary[];
  showFilter: boolean;
}) {
  const [filter, setFilter] = useState("");

  const dataFilter = (data: SaleSummary) => {
    return data.customer.name.toLowerCase().includes(filter.toLowerCase());
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {showFilter ? (
        <Input
          type="filter"
          placeholder="Filter..."
          className="w-full"
          onChange={(event) => {
            setFilter(event.target.value);
          }}
        />
      ) : (
        ""
      )}
      {salesSummary.filter(dataFilter).map((sale) => (
        <Link
          to={`/sales/${sale.id}`}
          key={sale.id}
          className="mb-8 flex flex-row w-full hover:scale-105 hover:bg-indigo-950 p-4 transition duration-800"
        >
          <div className="flex flex-col text-wrap">
            <strong className="text-slate-900 text-sm font-large dark:text-slate-200">
              {sale.customer.name}
            </strong>
            <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
              {format(sale.created_at, "PP")}
            </span>
            <span className="text-slate-500 text-sm font-medium dark:text-slate-400">
              Total Amount: {currency(sale.total_amount)}
            </span>
          </div>
          <div className="grow justify-self-stretch">
            <table className="table-auto w-[70%] justify-self-end ml-auto">
              {/* <col width="30%" />
              <col width="70%" /> */}
              {(sale.sale_item || []).map((item) => (
                <tr key={item.id} className="text-left leading-4">
                  {/* <th className="text-xs font-mono">
                    {item.product.product_type.name}
                  </th> */}
                  <td className="flex flex-row">
                    <div
                      className="rounded dark:ring-1 dark:ring-inset dark:ring-white/10 sm:w-full"
                      style={{
                        width: `${
                          ((item.unit_price * item.quantity) /
                            sale.total_amount) *
                          90
                        }%`,
                        backgroundColor: `${getProductColor(
                          item.product.product_type.name
                        )}`,
                      }}
                      title={`${item.quantity} x ${item.product.product_type.name}`}
                    >
                      &nbsp;
                    </div>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </Link>
      ))}
    </div>
  );
}
