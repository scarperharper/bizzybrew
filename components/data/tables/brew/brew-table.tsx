import { DataTable } from "../data-table";
import { Brew } from "@/data/models/Brew";
import { ColumnBuilder } from "../column-builder";

export function BrewTable({
  brews,
  onSelectionChanged,
}: {
  brews: Brew[];
  onSelectionChanged?: (selection: { [row: number]: boolean }) => void;
}) {
  const columns = new ColumnBuilder<Brew>()
    .withSelectColumn(true)
    .addTextColumn("name", "Name", "/brews")
    .addDateColumn("brew_date", "Brew Date")
    .addCurrencyColumn("total_cost", "Total Cost")
    .build();

  return (
    <div>
      <DataTable
        data={brews}
        columns={columns}
        filterBy={"name"}
        onSelectionChanged={onSelectionChanged}
      ></DataTable>
    </div>
  );
}
