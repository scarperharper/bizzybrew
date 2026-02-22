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
import { z } from 'zod';
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4';
import { useForm, getFormProps } from '@conform-to/react';
import { SubmitButton } from '@/components/form-elements/submit';
import { Combobox } from '@/components/local/combobox';
import { getSaleSummaryById } from '@/data/api/SaleApi';
import { Sale } from '@/data/models/Sale';
import { getAvailableProducts } from '@/data/api/ProductApi';
import invariant from 'tiny-invariant';
import { ProductSummary } from '@/data/models/Product';
import { InputHidden } from '@/components/form-elements/input-hidden';
import { CurrencyInput } from '@/components/form-elements/currency-input';
import { SaleItem } from '@/data/models/SaleItem';
import { insertOneSaleItem } from '@/data/api/SaleItemApi';
import { Input } from '@/components/form-elements/input';
import { authContext } from '~/context';
import { format } from 'date-fns';

const schema = z.object({
	created_at: z.coerce.date(),
	product_id: z.coerce.number().positive('Please select an option'),
	sale_id: z.coerce.number().positive('Please select an option'),
	unit_price: z.coerce.number().positive('Price must be positive'),
	quantity: z.coerce.number().positive('Quantity must be positive'),
});

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.saleId, 'Missing saleId param');
	const saleId: number = parseInt(params.saleId);

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [saleResult, productsResult] = await Promise.all([
		getSaleSummaryById(supabaseClient, saleId),
		getAvailableProducts(supabaseClient),
	]);
	if (!saleResult.success || !productsResult.success) {
		throw new Response(`Error getting data`, { status: 500 });
	}
	return { saleResult, productsResult };
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

	const created = await insertOneSaleItem(supabaseClient, userId, {
		...submission.value,
	});

	if (!created.success) {
		throw new Error(created.error?.message);
	}

	return redirect(`/sales/${(created.data as SaleItem).sale_id}`);
};

export default function AddSaleItem() {
	const { saleResult, productsResult } = useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();
	const sale = saleResult.data as unknown as Sale;
	const products = productsResult.data as unknown as ProductSummary[];

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			sale_id: sale.id.toString(),
			created_at: format(new Date(sale.created_at), 'yyyy-MM-dd'),
			unit_price: '0',
			quantity: '1',
			product_id: '',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const productOptions = (products || []).map((product) => ({
		value: product.id.toString(),
		label: `${product.brew.name}: ${product.product_type.name}, (${product.remaining}/${product.amount})`,
		entity: product,
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
						<DrawerTitle>New Sale Item</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<InputHidden
							name="sale_id"
							defaultValue={fields.sale_id.defaultValue}
						/>
						<InputHidden
							name="created_at"
							defaultValue={fields.created_at.defaultValue}
						/>
						<Combobox
							label="Product"
							options={productOptions}
							guidance={''}
							field={fields.product_id}
						/>
						<CurrencyInput
							label="Price"
							name="unit_price"
							defaultValue={fields.unit_price.defaultValue}
							errors={fields.unit_price.errors}
						/>
						<Input
							label="Quantity"
							key="quantity"
							defaultValue={fields.quantity.defaultValue}
							errors={fields.quantity.errors}
							name="quantity"
							type="number"
						/>
					</DrawerBody>
					<DrawerFooter>
						<SubmitButton
							name="intent"
							value="addSaleItem"
							submitText="Save"
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
