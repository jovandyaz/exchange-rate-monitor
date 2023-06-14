import { PropsWithChildren, useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useApiCall } from "../../../hooks";
import { DataTable, ErrorMessage } from "../../../components";
import XRateChart from "../XRateChart/XRateChart";
import Banner from "../Banner/Banner";
import { HighLowColumns, OpenCloseColumns } from "./ExchangeRateViewColumns";
import { ApiCallResult, HistoricData } from "../../../types/api.types";
import {
  ChartDataTypes,
  HighLowDataTypes,
  OpenCloseDataTypes,
} from "../../../types/global.types";
import "react-loading-skeleton/dist/skeleton.css";
import "./ExchangeRateView.css";

interface ExchangeRateProps {
  currencyPairId: string;
}

type HistoricDataType = HistoricData[];

const InlineWrapperWithMargin = ({ children }: PropsWithChildren<unknown>) => (
  <span>{children}</span>
);

const getUri = (currencyPairId: string) =>
  `${import.meta.env.VITE_BASE_URL}/historic-data/${currencyPairId}`;

const ExchangeRateView = ({
  currencyPairId,
}: ExchangeRateProps): JSX.Element => {
  const [highLowData, setHighLowData] = useState<HighLowDataTypes[]>([]);
  const [openCloseData, setOpenCloseData] = useState<OpenCloseDataTypes[]>([]);
  const [chartData, setChartData] = useState<ChartDataTypes[]>([]);

  const { data, loading, error, invoke } = useApiCall<
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
    invoke(getUri(currencyPairId));
  }, [currencyPairId, invoke]);

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

  if (error)
    return (
      <ErrorMessage
        message={"An error occurred. Try with another tab, please."}
      />
    );

  return (
    <>
      {!!data && Object.values(data).every((value) => value) && (
        <>
          <Banner
            currencyPairId={currencyPairId}
            openPrice={openCloseData[0]?.open}
          />
          <section className="tables-container">
            <div className="data-table-container">
              <label className="table-title">Historic Prices</label>
              <DataTable columns={HighLowColumns} data={highLowData} />
            </div>
            <div className="data-table-container">
              <label className="table-title">Daily Trend</label>
              <DataTable columns={OpenCloseColumns} data={openCloseData} />
            </div>
          </section>
          <section className="chart-container">
            <XRateChart chartTitle={currencyPairId} data={chartData} />
          </section>
        </>
      )}
    </>
  );
};

export default ExchangeRateView;
