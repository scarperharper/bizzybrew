import { DataTable } from '../data-table';
import { StockUsageSummary } from '@/data/models/StockUsage';
import type { TableSelection } from '@/data/models/util';
import { ColumnBuilder } from '../column-builder';
import { Brew } from '@/data/models/Brew';
import { LinkButton } from '../../util/buttons/link-button';
import { Form } from 'react-router';

export function StockUsageTable({
	stockUsageSummary,
	brew,
	onSelectionChanged,
}: {
	stockUsageSummary: StockUsageSummary[];
	brew: Brew;
	onSelectionChanged?: (selection: TableSelection) => void;
}) {
	const deleteUsage = (usage: StockUsageSummary) => {
		const form = document.getElementById('destroyForm') as HTMLFormElement;
		if (form) {
			form.action = `/brews/${brew.id}/stockUsage/${usage.stock_line_id}/destroy`;
			form.dispatchEvent(
				new Event('submit', { cancelable: true, bubbles: true })
			);
		}
	};

	const columns = new ColumnBuilder<StockUsageSummary>()
		.addTextColumn('group_name', 'Group Name')
		.addTextColumn('name', 'Name', '/stock-line', 'stock_line_id')
		.addTextColumn('sum_amount', 'Amount')
		.addCurrencyColumn('sum_cost', 'Cost')
		.withActionColumn({ deleteEntity: deleteUsage })
		.build();

	return (
		<div>
			<DataTable
				data={stockUsageSummary}
				columns={columns}
				getKey={(row) => row.id?.toString()}
				filterBy={'name'}
				pageSize={stockUsageSummary.length}
				onSelectionChanged={onSelectionChanged}
				enablePagination={false}
			>
				<LinkButton href={`/brews/${brew.id}/stockUsage/add`}>
					+ Add ingredient
				</LinkButton>
			</DataTable>

			<Form
				id="destroyForm"
				method="post"
				onSubmit={(event) => {
					const response = confirm(
						'Please confirm you want to delete this record.'
					);
					if (!response) {
						event.preventDefault();
					}
				}}
			></Form>
		</div>
	);
}
