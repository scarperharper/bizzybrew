import { DataTable } from "../data-table";
import { StockLineTransaction } from "@/data/models/StockLine";
import { ColumnBuilder } from "../column-builder";

export function StockLineTransactionTable({
  stockLineTransactions,
}: {
  stockLineTransactions: StockLineTransaction[];
}) {
  const columns = new ColumnBuilder<StockLineTransaction>()
    .addDateColumn("transaction_date", "Date")
    .addTextColumn("purchased", "Purchased")
    .addTextColumn("used", "used")
    .addTextColumn("receipt_name", "Receipt", "/receipts", "receipt_id")
    .addTextColumn("brew_name", "Brew", "/brews", "brew_id")
    .addTextColumn("running_total", "Total")
    .build();

  return (
    <div>
      <DataTable
        data={stockLineTransactions}
        columns={columns}
        filterBy={"narrative"}
        pageSize={stockLineTransactions.length}
      />
    </div>
  );
}
