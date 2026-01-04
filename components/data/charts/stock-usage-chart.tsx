import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ClientOnly } from 'remix-utils/client-only';

import { PieChart } from 'echarts/charts';

import {
	GridComponent,
	TooltipComponent,
	TitleComponent,
	LegendComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import { StockUsageSummary } from '@/data/models/StockUsage';
import type { EChartsReactProps } from 'echarts-for-react/lib/types';
import { useTheme } from 'next-themes';
import { currency } from '../tables/formatters/currency';

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	PieChart,
	CanvasRenderer,
	LegendComponent,
]);

export function StockUsageChart({ data }: { data: StockUsageSummary[] }) {
	const chartData = data.reduce((chartData, datum) => {
		const existing = chartData.find((d) => d.name == datum.group_name);
		if (existing) {
			existing.value += datum.sum_cost;
		} else {
			chartData.push({ value: datum.sum_cost, name: datum.group_name });
		}
		return chartData;
	}, [] as { value: number; name: string }[]);

	const option: EChartsReactProps['option'] = {
		tooltip: {
			trigger: 'item',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			formatter: function (item: any) {
				return `
          ${item.data.name} - ${currency(item.data.value)}
        `;
			},
		},
		legend: {
			top: '5%',
			left: '5%',
			orient: 'vertical',
			show: true,
		},
		series: [
			{
				name: 'Stock Usage',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				padAngle: 5,
				itemStyle: {
					borderRadius: 10,
				},
				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 40,
						fontWeight: 'bold',
					},
				},
				labelLine: {
					show: true,
				},
				data: chartData,
			},
		],
	};

	const { resolvedTheme } = useTheme();

	return (
		<ClientOnly fallback={<p>Loading...</p>}>
			{() => (
				<ReactEChartsCore
					echarts={echarts}
					option={option}
					notMerge={true}
					lazyUpdate={true}
					theme={resolvedTheme}
				/>
			)}
		</ClientOnly>
	);
}
