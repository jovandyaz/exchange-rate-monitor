import { PropsWithChildren, useEffect, useState } from "react";
import { useApiCall } from "../../../hooks";
import { DataTable } from "../../../components";
import XRateChart from "../XRateChart/XRateChart";

import { HighLowColumns, OpenCloseColumns } from "./HistoricPricesColumns";
import { ApiCallResult, HistoricData } from "../../../types/api.types";
import {
  ChartDataTypes,
  HighLowDataTypes,
  OpenCloseDataTypes,
} from "../../../types/global.types";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./HistoricPrices.css";

interface HistoricPricesProps {
  currencyPairId: string;
}

type HistoricDataType = HistoricData[];

const InlineWrapperWithMargin = ({ children }: PropsWithChildren<unknown>) => (
  <span>{children}</span>
);

const getUri = (currencyPairId: string) =>
  `${import.meta.env.VITE_BASE_URL}/historic-data/${currencyPairId}`;

export const HistoricPrices = ({
  currencyPairId,
}: HistoricPricesProps): JSX.Element => {
  const [highLowData, setHighLowData] = useState<HighLowDataTypes[]>([]);
  const [openCloseData, setOpenCloseData] = useState<OpenCloseDataTypes[]>([]);
  const [chartData, setChartData] = useState<ChartDataTypes[]>([]);

  const { data, loading, error, executeRequest } = useApiCall<
    ApiCallResult<HistoricDataType>
  >(getUri(currencyPairId));

  useEffect(() => {
    if (!!data && Object.values(data).every((value) => value)) {
      const highLowData = Object.entries(
        (data as unknown as HistoricData)["Time Series FX (Daily)"]
      ).map(([date, priceData], index) => {
        const { "2. high": high, "3. low": low } = priceData;
        return { id: index + 1, date, high, low };
      });
      setHighLowData(highLowData);

      const openCloseData = Object.entries(
        (data as unknown as HistoricData)["Time Series FX (Daily)"]
      ).map(([date, priceData], index) => {
        const { "1. open": open, "4. close": close } = priceData;
        return {
          id: index + 1,
          date,
          open,
          close,
          difference:
            +close - +open > 0
              ? `+${(+close - +open).toFixed(4)}`
              : (+close - +open).toFixed(4),
        };
      });
      setOpenCloseData(openCloseData);

      const chartData = Object.entries(
        (data as unknown as HistoricData)["Time Series FX (Daily)"]
      ).map(([date, priceData], index) => {
        const { "4. close": rate } = priceData;
        const formattedDate = new Date(date).toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
        });
        return { id: index + 1, date: formattedDate, rate };
      });
      setChartData(chartData.sort((a, b) => b.id - a.id));
    }
  }, [data]);

  useEffect(() => {
    executeRequest(getUri(currencyPairId));
  }, [currencyPairId, executeRequest]);

  if (loading)
    return (
      <SkeletonTheme baseColor="#202020" highlightColor="#444" height="20rem">
        <Skeleton
          count={2}
          wrapper={InlineWrapperWithMargin}
          inline
          width="50%"
        />
        <Skeleton />
      </SkeletonTheme>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <section className="tables-container">
        {!!data && Object.values(data).every((value) => value) && (
          <>
            <div className="data-table-container">
              <label className="table-title">Historic Prices</label>
              <DataTable columns={HighLowColumns} data={highLowData} />
            </div>
            <div className="data-table-container">
              <label className="table-title">Daily Trend</label>
              <DataTable columns={OpenCloseColumns} data={openCloseData} />
            </div>
          </>
        )}
      </section>
      <section className="chart-container">
        <XRateChart chartTitle={currencyPairId} data={chartData} />
      </section>
    </>
  );
};
