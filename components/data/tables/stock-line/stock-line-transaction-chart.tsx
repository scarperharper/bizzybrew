import { useState } from "react";
import { StockLineTransaction } from "@/data/models/StockLine";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  DataZoomComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOnly } from "remix-utils/client-only";
import { useTheme } from "next-themes";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  BarChart,
  LineChart,
]);

export function StockLineTransactionChart({
  stockLineTransactions,
}: {
  stockLineTransactions: StockLineTransaction[];
}) {
  const [mode, setMode] = useState("bar");
  const { resolvedTheme } = useTheme();

  const chartData = stockLineTransactions.reduce(
    (chartData, transaction, index) => {
      chartData.push({
        index,
        action: transaction.receipt_id ? "Purchase" : "Usage",
        date: new Date(transaction.transaction_date),
        purchased: transaction.purchased,
        used: transaction.used,
        parent: transaction.receipt_id
          ? transaction.receipt_name
          : transaction.brew_name,
        running_total: transaction.running_total,
      });

      return chartData;
    },
    [] as {
      index: number;
      action: string;
      date: Date;
      purchased: number;
      used: number;
      parent: string;
      running_total: number;
    }[]
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (series: any) {
        const [purchases] = [...series];
        const data = chartData[purchases.dataIndex];

        return `
          <table>
            <tr>
              <td>${data.action}</td>
              <td style="text-align:right">${format(data.date, "PP")}</td>
            </tr>
            <tr><td>Part of</td><td style="text-align:right">${data.parent
          }</td></tr>
            <tr><td>Amount</td><td style="text-align:right">${data.purchased || data.used
          }</td></tr>
            <tr><td>Stock Level</td><td style="text-align:right">${data.running_total
          }</td></tr>
          </table>
        `;
      },
    },
    legend: {
      data: ["Purchases", "Usages", "Stock Level"],
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "60px",
      top: "50px",
      containLabel: true,
    },
    xAxis: {
      type: mode === "bar" ? "category" : "time",
      data: chartData.map((d) => (mode === "bar" ? d.index : d.date)),
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false },
      axisLabel: {
        formatter: (value: number) => {
          return mode === "bar" ? "" : format(new Date(value), "PP");
        },
      },
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        //start: Math.max(0, 100 - (10 / chartData.length) * 100),
        //end: 100,
      },
    ],
    series: [
      {
        name: "Purchases",
        type: "bar",
        //stack: "stack",
        stackStrategy: "all",
        data: chartData.map((d) =>
          mode === "bar" ? d.purchased : [d.date, d.purchased]
        ),
      },
      {
        name: "Usages",
        type: "bar",
        //stack: "stack",
        stackStrategy: "all",
        data: chartData.map((d) =>
          mode === "bar" ? -d.used : [d.date, -d.used]
        ),
      },
      {
        name: "Stock Level",
        type: "line",
        smooth: true,
        data: chartData.map((d) =>
          mode === "bar" ? d.running_total : [d.date, d.running_total]
        ),
      },
    ],
  };

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
              <TabsTrigger value="timeseries">Timeseries</TabsTrigger>
              <TabsTrigger value="bar">Equal Columns</TabsTrigger>
            </TabsList>
          </Tabs>
          <ReactEChartsCore
            echarts={echarts}
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: "100%" }}
            theme={resolvedTheme}
          />
        </div>
      )}
    </ClientOnly>
  );
}
