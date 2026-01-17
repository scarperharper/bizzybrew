import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import {
	redirect,
	Form,
	useActionData,
	useLoaderData,
	useNavigate,
} from 'react-router';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4';
import {
	useForm,
	getFormProps,
	type SubmissionResult,
} from '@conform-to/react';
import { InputHidden } from '@/components/form-elements/input-hidden';
import { Input } from '@/components/form-elements/input';
import { SubmitButton } from '@/components/form-elements/submit';
import { insertOneStockPurchase } from '@/data/api/StockPurchaseApi';
import { StockPurchase } from '@/data/models/StockPurchase';
import { getReceiptById } from '@/data/api/ReceiptApi';
import {
	getStockLineSummary,
	insertOneStockLine,
} from '@/data/api/StockLineApi';
import { StockLine, StockLineSummary } from '@/data/models/StockLine';
import { Receipt } from '@/data/models/Receipt';
import { useEffect, useState } from 'react';
import { getStockGroups } from '@/data/api/StockGroupApi';
import { StockGroup } from '@/data/models/StockGroup';
import { Combobox } from '@/components/local/combobox';
import { useDisclosure } from '@chakra-ui/react';
import { Select } from '@/components/form-elements/select';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from '@/components/ui/dialog';
import type { ApiResult } from '@/data/api/ApiResult';
import { CurrencyInput } from '@/components/form-elements/currency-input';
import { getAuthenticatedClient } from '~/supabase.auth.server';
import { format } from 'date-fns';

const purchaseSchema = z.object({
	receipt_id: z.coerce.number(),
	stock_line_id: z.coerce.number().positive('Please select an option'),
	purchase_date: z.coerce.date(),
	details: z.string().optional(),
	amount: z.coerce.number().positive('Please choose a valid amount'),
	cost: z.coerce.number().positive('Please choose a valid amount'),
});

const createStockLineSchema = z.object({
	stockLineName: z.string().min(1, 'Stock line name is required'),
	stockLineGroupId: z.coerce.number().positive('Please select an option'),
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.receiptId, 'Missing receiptId param');

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [receiptResponse, stockLineSummaryResponse, stockGroupsResponse] =
		await Promise.all([
			getReceiptById(supabaseClient, userId, parseInt(params.receiptId)),
			getStockLineSummary(supabaseClient, userId),
			getStockGroups(supabaseClient, userId),
		]);

	if (!receiptResponse.success || !stockLineSummaryResponse.success) {
		throw new Response(`Error getting data`, { status: 404 });
	}
	return {
		receiptResponse,
		stockLineSummaryResponse,
		stockGroupsResponse,
	};
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const formData = await request.formData();
	const intent = formData.get('intent');

	if (intent == 'addPurchase') {
		const submission = parseWithZod(formData, { schema: purchaseSchema });
		if (submission.status !== 'success') {
			return submission.reply();
		}
		const created = await insertOneStockPurchase(supabaseClient, userId, {
			stock_line_id: submission.value.stock_line_id,
			details: submission.value.details || '',
			amount: submission.value.amount,
			cost: submission.value.cost,
			receipt_id: submission.value.receipt_id,
			purchase_date: submission.value.purchase_date,
		});
		return redirect(
			`/receipts/${(created.data as StockPurchase).receipt_id}`,
		);
	} else if (intent == 'createStockLine') {
		const submission = parseWithZod(formData, {
			schema: createStockLineSchema,
		});
		if (submission.status !== 'success') {
			return submission.reply();
		}

		const stockLine = await insertOneStockLine(supabaseClient, userId, {
			stock_group_id: submission.value.stockLineGroupId,
			name: submission.value.stockLineName,
			stock_level: 0,
			last_update: new Date(),
		});

		return stockLine;
	}
};

export default function AddStockUsage() {
	const { receiptResponse, stockLineSummaryResponse, stockGroupsResponse } =
		useLoaderData<typeof loader>();
	const lastResult = useActionData<SubmissionResult<string[]>>();
	const receipt = receiptResponse.data as unknown as Receipt;
	const stockLineSummary =
		stockLineSummaryResponse.data as unknown as StockLineSummary[];
	const stockGroups = stockGroupsResponse.data as unknown as StockGroup[];

	console.log({ receipt });

	const [purchaseForm, purchaseFields] = useForm({
		lastResult,
		constraint: getZodConstraint(purchaseSchema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			receipt_id: receipt.id.toString(),
			purchase_date: format(new Date(receipt.date), 'yyyy-MM-dd'),
			amount: '0',
			cost: '0',
			details: '',
			stock_line_id: '',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: purchaseSchema });
		},
	});

	const [createStockLineForm, createStockLineFields] = useForm({
		constraint: getZodConstraint(createStockLineSchema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			stockLineGroupId: '',
			stockLineName: '',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: createStockLineSchema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const stockLineOptions = (stockLineSummary || []).map((line) => ({
		value: line.id.toString(),
		label: `${line.group_name}: ${line.name}`,
	}));

	const createStockLineDialog = useDisclosure();
	const [created, setCreated] = useState('');
	const [stockLineId, setStockLineId] = useState('');

	const stockGroupOptions = (stockGroups || []).map((line) => ({
		value: line.id.toString(),
		label: `${line.group_name}`,
	}));

	const actionData = useActionData<typeof action>();

	useEffect(() => {
		if (actionData) {
			createStockLineDialog.onClose();
			const id = ((actionData as ApiResult<StockLine>).data as StockLine)
				.id;
			if (id) {
				setStockLineId(id.toString());
			}
		}
	}, [createStockLineDialog, actionData]);

	useEffect(() => {
		if (created) {
			createStockLineForm.update({
				name: createStockLineFields.stockLineName.name,
				value: created,
			});
		}
	}, [
		created,
		createStockLineForm,
		createStockLineFields.stockLineName.name,
	]);

	return (
		<>
			<Drawer
				open
				onOpenChange={(open) => {
					if (!open) onClose();
				}}
			>
				<DrawerContent>
					<Form
						method="post"
						className="flex flex-col flex-1"
						{...getFormProps(purchaseForm)}
					>
						<DrawerHeader>
							<DrawerTitle>New Purchase</DrawerTitle>
						</DrawerHeader>

						<DrawerBody>
							<InputHidden
								name="receipt_id"
								field={purchaseFields.receipt_id}
							/>
							<Combobox
								options={stockLineOptions}
								label="Ingredient"
								guidance=""
								value={stockLineId}
								field={purchaseFields.stock_line_id}
								onCreateOption={(option) => {
									createStockLineDialog.onOpen();
									setCreated(option);
								}}
							/>

							<Input
								label="Purchase Date"
								errors={purchaseFields.purchase_date.errors}
								name="purchase_date"
								defaultValue={
									purchaseFields.purchase_date.defaultValue
								}
								type="date"
							/>
							<Input
								label="Amount"
								errors={purchaseFields.amount.errors}
								name="amount"
								defaultValue={
									purchaseFields.amount.defaultValue
								}
								type="text"
							/>
							<CurrencyInput
								label="Cost"
								field={purchaseFields.cost}
							/>
							<Input
								label="Details"
								errors={purchaseFields.details.errors}
								name="details"
								defaultValue={
									purchaseFields.details.defaultValue
								}
								type="number"
							/>
						</DrawerBody>
						<DrawerFooter>
							<SubmitButton name="intent" value="addPurchase" />
							<Button onClick={onClose} type="reset">
								Cancel
							</Button>
						</DrawerFooter>
					</Form>
				</DrawerContent>
			</Drawer>

			<Dialog open={createStockLineDialog.isOpen}>
				<DialogOverlay className="DialogOverlay" />
				<DialogContent
					className="sm:max-w-[425px]"
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>Create a new stock line</DialogTitle>
						<DialogDescription>
							Confirm the name and select a stock group
						</DialogDescription>
					</DialogHeader>

					<Form
						method="post"
						className="flex flex-col flex-1"
						{...getFormProps(createStockLineForm)}
					>
						<Input
							label="Name"
							errors={createStockLineFields.stockLineName.errors}
							name="stockLineName"
							defaultValue={
								createStockLineFields.stockLineName.defaultValue
							}
							type="text"
						/>
						<Select
							label="Stock Group"
							options={stockGroupOptions}
							field={createStockLineFields.stockLineGroupId}
						/>
						<DialogFooter>
							<SubmitButton
								name="intent"
								value="createStockLine"
							/>
							<DialogClose asChild>
								<Button>Cancel</Button>
							</DialogClose>
						</DialogFooter>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}
