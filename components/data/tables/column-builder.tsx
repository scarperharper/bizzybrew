import React from 'react';
import { Entity } from '@/data/models/Entity';
import {
	type Row,
	type ColumnDef,
	type Column,
	type Table,
} from '@tanstack/react-table';
import { currency } from './formatters/currency';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router';

export class ColumnBuilder<T extends Entity> {
	columns: ColumnDef<T>[];

	constructor() {
		this.columns = [];
	}

	withSelectColumn(includeHeader = false) {
		const column: ColumnDef<T> = {
			id: 'select',

			cell: ({ row }: { row: Row<T> }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value: boolean) => {
						row.toggleSelected(!!value);
					}}
					aria-label="Select row"
				/>
			),

			enableSorting: false,
			enableHiding: false,
		};

		if (includeHeader) {
			column.header = ({ table }: { table: Table<T> }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) =>
						table.toggleAllPageRowsSelected(!!value)
					}
					aria-label="Select all"
				/>
			);
		}

		this.columns.push(column);
		return this;
	}

	addTextColumn(
		key: string,
		label: string,
		linkStub?: string,
		linkIdField: string = 'id'
	) {
		this.columns.push({
			accessorKey: key,

			//TODO: review this - intention is to be able to pass nested values
			accessorFn: (row) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const deepGet = (obj: any, keys: string[]) =>
					keys.reduce((xs, x) => xs?.[x] ?? null, obj);
				return deepGet(row, key.split('>'));
			},

			header: ({ column }: { column: Column<T> }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => {
							column.toggleSorting(
								column.getIsSorted() === 'asc'
							);
						}}
					>
						{label}
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},

			cell: ({ row }) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const deepGet = (obj: any, keys: string[]) =>
					keys.reduce((xs, x) => xs?.[x] ?? null, obj);
				const cellValue = deepGet(row.original, key.split('>'));

				if (linkStub)
					return (
						<Link
							to={`${linkStub}/${deepGet(
								row.original,
								linkIdField.split('>')
							)}`}
						>
							<span className="hover:underline">{cellValue}</span>
						</Link>
					);

				return cellValue;
			},
		});
		return this;
	}

	addDateColumn(key: string, label: string) {
		this.columns.push({
			accessorKey: key,

			cell: ({ row }: { row: Row<T> }) => {
				const date = new Date(row.getValue(key));
				return (
					<time dateTime={date.toISOString()}>
						{format(date, 'LLLL d, yyyy')}
					</time>
				);
			},

			header: ({ column }: { column: Column<T> }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => {
							column.toggleSorting(
								column.getIsSorted() === 'asc'
							);
						}}
					>
						{label}
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
		});
		return this;
	}

	addCurrencyColumn(key: string, label: string) {
		this.columns.push({
			accessorKey: key,

			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === 'asc')
						}
					>
						{label}
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},

			cell: ({ row }) => currency(parseInt(row.getValue(key))),
		});
		return this;
	}

	withActionColumn({
		editEntity,
		deleteEntity,
	}: {
		editEntity?: (entity: T) => void;
		deleteEntity?: (entity: T) => void;
	}) {
		this.columns.push({
			id: 'actions',
			cell: ({ row }) => {
				const entity = row.original;

				// eslint-disable-next-line react-hooks/rules-of-hooks
				const [menuOpen, setMenuOpen] = React.useState(false);

				return (
					<div className="float-end">
						<DropdownMenu
							open={menuOpen}
							onOpenChange={setMenuOpen}
						>
							<DropdownMenuTrigger asChild>
								<Button
									variant="secondary"
									className="h-8 w-8 p-0"
								>
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								{editEntity ? (
									<DropdownMenuItem
										onClick={() => {
											editEntity(entity);
										}}
									>
										Edit
									</DropdownMenuItem>
								) : (
									''
								)}

								{deleteEntity ? (
									<DropdownMenuItem
										onClick={() => {
											deleteEntity(entity);
										}}
									>
										Delete
									</DropdownMenuItem>
								) : (
									''
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		});
		return this;
	}

	build() {
		return this.columns;
	}
}
