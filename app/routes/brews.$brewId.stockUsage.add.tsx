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
	useLoaderData,
	useNavigate,
	useActionData,
} from 'react-router';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4';
import { useForm, getFormProps } from '@conform-to/react';
import { InputHidden } from '@/components/form-elements/input-hidden';
import { Input } from '@/components/form-elements/input';
import { SubmitButton } from '@/components/form-elements/submit';
import { StockUsageRequest } from '@/data/models/StockUsage';
import { getRemainingPurchases } from '@/data/api/StockPurchaseApi';
import { RemainingPurchase } from '@/data/models/StockPurchase';
import { getBrewById } from '@/data/api/BrewApi';
import { Brew } from '@/data/models/Brew';
import { addStockUsage } from '@/data/api/StockUsageApi';
import { Combobox } from '@/components/local/combobox';
import { authContext } from '~/context';
import { format } from 'date-fns';

const schema = z.object({
	brew_id: z.coerce.number(),
	stock_line_id: z.coerce.number().positive('Please select an option'),
	usage_date: z.coerce.date(),
	amount: z.coerce.number().positive('Please choose a valid amount'),
});

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.brewId, 'Missing stockUsageId param');

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [brewResult, stockPurchaseSummaryResult] = await Promise.all([
		getBrewById(supabaseClient, parseInt(params.brewId)),
		getRemainingPurchases(supabaseClient),
	]);

	if (!brewResult.success || !stockPurchaseSummaryResult.success) {
		throw new Response(`Error getting data`, { status: 404 });
	}
	return { brewResult, stockPurchaseSummaryResult };
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== 'success') {
		return submission.reply();
	}

	const created = await addStockUsage(
		supabaseClient,
		userId,
		submission.value,
	);
	const intent = formData.get('intent');

	if (intent == 'saveAndAdd') {
		return redirect(
			`/brews/${
				(created.data as StockUsageRequest).brew_id
			}/stockUsage/add`,
		);
	}
	return redirect(`/brews/${(created.data as StockUsageRequest).brew_id}`);
};

export default function AddStockUsage() {
	const { brewResult, stockPurchaseSummaryResult } =
		useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();
	const brew = brewResult.data as unknown as Brew;
	const stockPurchaseSummary =
		stockPurchaseSummaryResult.data as unknown as RemainingPurchase[];

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			brew_id: brew.id.toString(),
			usage_date: format(new Date(brew.brew_date), 'yyyy-MM-dd'),
			amount: '0',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const stockPurchaseOptions = (stockPurchaseSummary || []).map((line) => ({
		value: line.id.toString(),
		label: `${line.group_name}: ${line.name} / ${line.remaining}`,
	}));

	return (
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
					{...getFormProps(form)}
				>
					<DrawerHeader>
						<DrawerTitle>New Ingredient</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<InputHidden
							name="brew_id"
							defaultValue={fields.brew_id.defaultValue}
						/>
						<Combobox
							label="Ingredient"
							options={stockPurchaseOptions}
							guidance={''}
							field={fields.stock_line_id}
						/>
						<Input
							label="Usage Date"
							name="usage_date"
							defaultValue={fields.usage_date.defaultValue}
							errors={fields.usage_date.errors}
							type="date"
						/>
						<Input
							label="Amount"
							name="amount"
							defaultValue={fields.amount.defaultValue}
							errors={fields.amount.errors}
							type="number"
						/>
					</DrawerBody>
					<DrawerFooter>
						<SubmitButton
							name="intent"
							value="save"
							submitText="Save"
							submittingText="Saving..."
						/>
						<SubmitButton
							name="intent"
							value="saveAndAdd"
							submitText="Save &amp; add another"
							submittingText="Saving..."
						/>
						<Button onClick={onClose} type="reset">
							Cancel
						</Button>
					</DrawerFooter>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
