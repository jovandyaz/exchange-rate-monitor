import { ReactElement, useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import type { LineSeriesOption } from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { ChartDataTypes } from "../../../types/global.types";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  DataZoomComponent,
]);

type ECOption = ComposeOption<
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

interface XRateChartProps {
  chartTitle: string;
  data: ChartDataTypes[];
}

const XRateChart = ({ chartTitle, data }: XRateChartProps): ReactElement => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current, {
        renderer: "svg",
      });

      const option: ECOption = {
        title: {
          text: chartTitle,
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
          backgroundColor: "#000",
        },
        dataset: {
          source: data,
        },
        xAxis: {
          type: "category",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff",
            },
          },
        },
        yAxis: {
          type: "value",
          position: "right",
          splitLine: {
            lineStyle: {
              color: "#333333",
            },
          },
        },
        series: [
          {
            type: "line",
            smooth: true,
            symbol: "none",
            encode: {
              x: "date",
              y: "rate",
            },
            yAxisIndex: 0,
            lineStyle: {
              color: "#Dca312",
            },
          },
        ],
        dataZoom: {
          type: "slider",
          start: 0,
          end: 10,
        },
      };

      chart.setOption(option);
    }
  }, [chartTitle, data]);

  return (
    <div ref={chartRef} style={{ height: "600px", background: "black" }} />
  );
};

export default XRateChart;
