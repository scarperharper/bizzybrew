import { StockPurchaseSummary } from '@/data/models/StockPurchase';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ClientOnly } from 'remix-utils/client-only';

import { SunburstChart, type SunburstSeriesOption } from 'echarts/charts';

import {
	GridComponent,
	TooltipComponent,
	TitleComponent,
	LegendComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsReactProps } from 'echarts-for-react/lib/types';
import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	SunburstChart,
	CanvasRenderer,
	LegendComponent,
]);

type ChartDatum = {
	name: string;
	value?: number;
	children?: ChartDatum[];
	itemStyle?: {
		color: string;
	};
	tooltip?: SunburstSeriesOption['tooltip'];
	label?: SunburstSeriesOption['label'];
};

export function StockPurchaseUsageTree({
	stockPurchases,
}: {
	stockPurchases: StockPurchaseSummary[];
}) {
	const { resolvedTheme } = useTheme();
	const [mode, setMode] = useState('cost');
	const [chartOptions, setChartOptions] = useState(
		{} as EChartsReactProps['option']
	);

	const formatValue = (amount: number, mode: string): string => {
		return mode == 'cost'
			? new Intl.NumberFormat('en-GB', {
					style: 'currency',
					currency: 'GBP',
			  }).format(amount / 100)
			: amount.toString();
	};

	useEffect(() => {
		const data: ChartDatum[] = [];

		stockPurchases.forEach((purchase) => {
			const children: ChartDatum[] = (purchase.stock_usage || []).map(
				(usage) => {
					const value =
						mode == 'cost'
							? (usage.amount || 0) * purchase.unit_cost
							: usage.amount;
					return {
						name: usage.brew?.name || '',
						value: value,
						emphasis: {
							label: {
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								formatter: (value: any) =>
									`${value.name}\n${formatValue(
										value.value,
										mode
									)}`,
							},
						},
					};
				}
			);

			if (purchase.remaining > 0) {
				const remaining =
					mode == 'cost'
						? purchase.remaining * purchase.unit_cost
						: purchase.remaining;
				children.push({
					name: '',
					value: remaining,
					itemStyle: {
						color: '#666',
					},
				});
			}

			data.push({
				name: purchase.stock_line?.name || '',
				children,
			});
		});

		setChartOptions({
			series: {
				type: 'sunburst',
				data,
				radius: [0, '95%'],
				itemStyle: {
					borderRadius: 7,
					borderWidth: 0,
				},
				emphasis: {
					focus: 'ancestor',
				},
				levels: [
					{},
					{
						r0: '15%',
						r: '50%',
						itemStyle: {
							borderWidth: 2,
						},
						label: {
							rotate: 'tangential',
						},
					},
					{
						r0: '50%',
						r: '95%',
						label: {
							align: 'right',
						},
					},
				],
			},
		});
	}, [mode, stockPurchases]);

	return (
		<ClientOnly fallback={<p>Loading...</p>}>
			{() => (
				<div className="flex-1 w-full h-[800px] pb-12">
					<Tabs
						defaultValue={mode}
						onValueChange={(mode: string) => setMode(mode)}
						className="space-y-4"
					>
						<TabsList>
							<TabsTrigger value="amount">By amount</TabsTrigger>
							<TabsTrigger value="cost">By cost</TabsTrigger>
						</TabsList>
					</Tabs>
					<ReactEChartsCore
						echarts={echarts}
						option={chartOptions}
						notMerge={true}
						lazyUpdate={true}
						theme={resolvedTheme}
						style={{ height: '500px' }}
					/>
				</div>
			)}
		</ClientOnly>
	);
}
