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
import { Combobox } from '@/components/local/combobox';
import {
	getProductById,
	getProductTypes,
	insertOneProduct,
	updateOneProduct,
} from '@/data/api/ProductApi';
import { Product } from '@/data/models/Product';
import { ProductType } from '@/data/models/ProductType';
import { CurrencyInput } from '@/components/form-elements/currency-input';
import { getAuthenticatedClient } from '~/supabase.auth.server';

const schema = z.object({
	id: z.coerce.number(),
	brew_id: z.coerce.number(),
	product_type_id: z.coerce.number().positive('Please select an option'),
	amount: z.coerce.number().positive('Please choose a valid amount'),
	remaining: z.coerce.number().min(0, 'Please choose a valid amount'),
	list_price: z.coerce.number().min(0, 'Please choose a valid amount'),
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.brewId, 'Missing brewId param');
	invariant(params.productId, 'Missing productId param');

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [productResult, productTypesResult] = await Promise.all([
		getProductById(supabaseClient, parseInt(params.productId)),
		getProductTypes(supabaseClient),
	]);

	if (!productResult.success || !productTypesResult.success) {
		throw new Response(
			`Error getting data ${JSON.stringify({
				productResult,
				productTypesResult,
			})}`,
			{ status: 500 },
		);
	}
	return {
		productResult,
		productTypesResult,
		brewId: params.brewId,
		productId: params.productId,
	};
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== 'success') {
		return submission.reply();
	}

	if (submission.value.id == -1) {
		const inserted = await insertOneProduct(
			supabaseClient,
			userId,
			submission.value,
		);
		if (!inserted.success) {
			throw new Error(`Error inserting data ${inserted.error?.message}`);
		}
	} else {
		const updated = await updateOneProduct(
			supabaseClient,
			submission.value,
		);
		if (!updated.success) {
			throw new Error(`Error updating data ${updated.error?.message}`);
		}
	}

	return redirect(`/brews/${submission.value.brew_id}`);
};

export default function EditProduct() {
	const { productResult, productTypesResult, brewId, productId } =
		useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();
	const productTypes = productTypesResult.data as unknown as ProductType[];
	const product = productResult.data as unknown as Product;

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			id: productId,
			brew_id: brewId,
			amount: product?.amount?.toString() || '0',
			remaining: product?.remaining?.toString() || '0',
			product_type_id: product?.product_type_id?.toString() || '',
			list_price: product?.list_price?.toString() || '0',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const productTypesOptions = (productTypes || []).map((line) => ({
		value: line.id.toString(),
		label: `${line.name}`,
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
						<DrawerTitle>
							{product ? 'Edit' : 'New'} Product
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<InputHidden
							name="id"
							defaultValue={fields.id.defaultValue}
						/>
						<InputHidden
							name="brew_id"
							defaultValue={fields.brew_id.defaultValue}
						/>
						<Combobox
							label="Product Type"
							options={productTypesOptions}
							guidance={''}
							value={product?.product_type_id?.toString()}
							field={fields.product_type_id}
						/>
						<Input
							label="Amount"
							key="amount"
							defaultValue={fields.amount.defaultValue}
							errors={fields.amount.errors}
							name="amount"
							type="number"
						/>
						<Input
							label="Remaining"
							key="amount"
							defaultValue={fields.remaining.defaultValue}
							errors={fields.remaining.errors}
							name="remaining"
							type="number"
						/>
						<CurrencyInput
							label="List Price"
							name="list_price"
							defaultValue={fields.list_price.defaultValue}
							errors={fields.list_price.errors}
						/>
					</DrawerBody>
					<DrawerFooter>
						<SubmitButton
							name="intent"
							value="save"
							submitText="Save"
							submittingText="Saving..."
						/>
						{brewId == '-1' ? (
							<SubmitButton
								name="intent"
								value="saveAndAdd"
								submitText="Save &amp; add another"
								submittingText="Saving..."
							/>
						) : (
							''
						)}
						<Button onClick={onClose} type="reset">
							Cancel
						</Button>
					</DrawerFooter>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
