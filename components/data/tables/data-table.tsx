import { useState, useEffect, type ReactNode } from 'react';
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { DataTablePagination } from '@/components/local/data-table-pagination';
import { DataTableToolbar } from '@/components/local/data-table-toolbar';
import { type TableSelection } from '@/data/models/util';
import { Entity } from '@/data/models/Entity';

export interface DataTableProps<TData extends Entity, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	enablePagination?: boolean;
	filterBy?: string;
	getKey?: (row: TData) => string;
	pageSize?: number;
	onSelectionChanged?: (selection: TableSelection) => void;
	children?: ReactNode;
}

export function DataTable<TData extends Entity, TValue>({
	columns,
	data,
	enablePagination = true,
	filterBy,
	getKey,
	pageSize,
	onSelectionChanged,
	children,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);
	const [rowSelection, setRowSelection] = useState({});

	useEffect(() => {
		if (onSelectionChanged) {
			onSelectionChanged(rowSelection || {});
		}
	}, [onSelectionChanged, rowSelection]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		enableMultiRowSelection: false,
		initialState: {
			pagination: {
				pageSize: pageSize || 10,
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		getRowId: (row, index) => {
			if (getKey) {
				return getKey(row);
			}
			return index.toString();
		},
	});

	useEffect(() => {
		if (pageSize) {
			table.setPageSize(pageSize);
		}
	}, [table, pageSize]);

	return (
		<div className="space-y-4">
			{children ? (
				<DataTableToolbar table={table} filterBy={filterBy || ''}>
					{children}
				</DataTableToolbar>
			) : (
				''
			)}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && 'selected'
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{enablePagination && <DataTablePagination table={table} />}
		</div>
	);
}
