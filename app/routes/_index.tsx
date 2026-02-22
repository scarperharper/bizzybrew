import {
	redirect,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router';
import { Card } from '@tremor/react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getRecentBrews } from '@/data/api/BrewApi';
import { RecentBrewsPanel } from '@/components/brew/recent-brews-panel';
import { useLoaderData } from 'react-router';
import { RecentBrew } from '@/data/models/Brew';
import { getReceiptSummary } from '@/data/api/ReceiptApi';
import { ReceiptSummaryPanel } from '@/components/receipt/receipt-summary-panel';
import { ReceiptSummary } from '@/data/models/Receipt';
import { getAvailableProducts } from '@/data/api/ProductApi';
import { ProductSummary } from '@/data/models/Product';
import { AvailableProductsPanel } from '@/components/product/available-products-panel';
import { SalesSummaryPanel } from '@/components/sale/sales-summary-panel';
import { getSalesSummary } from '@/data/api/SaleApi';
import { SaleSummary } from '@/data/models/Sale';
import { authContext } from '~/context';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Bizzybrew' },
		{ name: 'description', content: "Let's get bizzy brewing!" },
	];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [
		recentBrewsResponse,
		receiptSummaryResponse,
		availableProductsResponse,
		salesSummaryResponse,
	] = await Promise.all([
		getRecentBrews({ supabaseClient, to: 4 }),
		getReceiptSummary(supabaseClient, 5),
		getAvailableProducts(supabaseClient),
		getSalesSummary(supabaseClient),
	]);

	for (const response of [
		recentBrewsResponse,
		receiptSummaryResponse,
		availableProductsResponse,
		salesSummaryResponse,
	]) {
		if (!response.success) {
			throw new Error(`Error getting data ${response.error?.message}`);
		}
	}

	return {
		recentBrewsResponse,
		receiptSummaryResponse,
		availableProductsResponse,
		salesSummaryResponse,
	};
};

export default function Index() {
	const {
		recentBrewsResponse,
		receiptSummaryResponse,
		availableProductsResponse,
		salesSummaryResponse,
	} = useLoaderData<typeof loader>();
	const recentBrews = recentBrewsResponse.data as unknown as RecentBrew[];
	const receiptSummary =
		receiptSummaryResponse.data as unknown as ReceiptSummary[];
	const availableProducts =
		availableProductsResponse.data as unknown as ProductSummary[];
	const salesSummary = salesSummaryResponse.data as unknown as SaleSummary[];

	return (
		<>
			{/*<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div> */}

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Brews</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<RecentBrewsPanel recentBrews={recentBrews} />
					</CardContent>
				</Card>
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Receipts</CardTitle>
						{/* <CardDescription>You made 265 sales this month.</CardDescription> */}
					</CardHeader>
					<CardContent>
						<ReceiptSummaryPanel
							receiptSummary={receiptSummary}
							showFilter={false}
						/>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Available Products</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<AvailableProductsPanel
							availableProducts={availableProducts}
						/>
					</CardContent>
				</Card>
				<Card className="col-span-2">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
						{/* <CardDescription>You made 265 sales this month.</CardDescription> */}
					</CardHeader>
					<CardContent>
						<SalesSummaryPanel
							salesSummary={salesSummary}
							showFilter={false}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
