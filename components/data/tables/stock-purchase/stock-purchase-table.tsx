import { DataTable } from "../data-table";
import { ColumnBuilder } from "../column-builder";
import { StockPurchaseSummary } from "@/data/models/StockPurchase";
import { Receipt } from "@/data/models/Receipt";
import { LinkButton } from "../../util/buttons/link-button";
import { Form } from "react-router";

export function StockPurchaseTable({
  stockPurchases,
  receipt,
  onSelectionChanged,
}: {
  stockPurchases: StockPurchaseSummary[];
  receipt: Receipt;
  onSelectionChanged?: (selection: { [row: number]: boolean }) => void;
}) {
  const deleteStockPurchase = (stockPurchase: StockPurchaseSummary) => {
    const form = document.getElementById("destroyForm") as HTMLFormElement;
    if (form) {
      form.action = `/receipts/${receipt.id}/stockPurchase/${stockPurchase.id}/destroy`;
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const columns = new ColumnBuilder<StockPurchaseSummary>()
    .addTextColumn("stock_line>stock_group>group_name", "Group Name")
    .addTextColumn("stock_line>name", "Name", "/stock-line", "stock_line>id")
    .addTextColumn("amount", "Amount")
    .addCurrencyColumn("cost", "Cost")
    .withActionColumn({
      deleteEntity: deleteStockPurchase,
    })
    .build();

  return (
    <div>
      <DataTable
        data={stockPurchases}
        columns={columns}
        filterBy={"stock_line>name"}
        onSelectionChanged={onSelectionChanged}
      >
        <LinkButton href={`/receipts/${receipt.id}/stockPurchase/add`}>
          + Add purchase
        </LinkButton>
      </DataTable>

      <Form
        id="destroyForm"
        method="post"
        onSubmit={(event) => {
          const response = confirm(
            "Please confirm you want to delete this record."
          );
          if (!response) {
            event.preventDefault();
          }
        }}
      ></Form>
    </div>
  );
}
