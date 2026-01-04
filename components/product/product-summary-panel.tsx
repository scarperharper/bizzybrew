import { ProductSummary } from '@/data/models/Product';
import { Brew } from '@/data/models/Brew';
import { LinkButton } from '../data/util/buttons/link-button';
import { ConfirmActionButton } from '../data/util/buttons/confirm-action-button';
import { Currency } from '../currency';
import { format } from 'date-fns';

export function ProductSummaryPanel({
	productSummary,
	brew,
}: {
	productSummary: ProductSummary[];
	brew: Brew;
}) {
	return (
		<div className="flex flex-col gap-4 p-4 w-full">
			<h1>Products</h1>
			<ul>
				{(productSummary || []).map((item) => (
					<li key={item.id} className="flex flex-col w-full pb-4">
						<div className="flex flex-row">
							<div className="flex flex-col text-wrap">
								<strong className="text-slate-900 text-sm font-medium dark:text-slate-200 overflow-hidden line-clamp-2">
									{item.product_type.name}
								</strong>
								<span className="text-slate-500 text-sm font-medium dark:text-slate-400">
									{item.remaining} remaining of {item.amount}
								</span>
								<span className="text-slate-500 text-sm font-medium dark:text-slate-400">
									List Price:{' '}
									<Currency amount={item.list_price} />
								</span>
								<span className="text-slate-500 text-sm font-small dark:text-slate-400">
									Proceeds:{' '}
									<Currency amount={item.total_sales} />
								</span>
								<ul className="ml-6 mt-2 flex flex-col">
									{(item?.sale_item || []).map(
										(sale_item) => (
											<li
												key={sale_item.id}
												className="mb-2"
											>
												{/* <pre>{JSON.stringify(sale_item)}</pre> */}
												<span className="text-slate-900 text-sm font-medium dark:text-slate-200">
													{
														sale_item.sale.customer
															.name
													}
												</span>
												<p className="text-sm font-medium dark:text-slate-200">
													{format(
														sale_item.created_at,
														'PPP'
													)}
												</p>
												<span className="text-slate-500 text-sm font-medium dark:text-slate-400">
													Proceeds:{' '}
													{sale_item.quantity} x{' '}
													<Currency
														amount={
															sale_item.unit_price
														}
													/>{' '}
													={' '}
													<Currency
														amount={
															sale_item.unit_price *
															sale_item.quantity
														}
													/>
												</span>
											</li>
										)
									)}
								</ul>
							</div>
							<div className="ml-auto">
								<LinkButton
									href={`/brews/${brew.id}/product/${item.id}/edit`}
								>
									Edit
								</LinkButton>

								<ConfirmActionButton
									action={`/brews/${brew.id}/product/${item.id}/destroy`}
									className="bg-destructive"
								>
									Delete
								</ConfirmActionButton>
							</div>
						</div>
						<div></div>
					</li>
				))}
			</ul>

			<div className="ml-auto">
				<LinkButton href={`/brews/${brew.id}/product/-1/edit`}>
					+ Add product
				</LinkButton>
			</div>
		</div>
	);
}
