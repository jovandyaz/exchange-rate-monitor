import { ReactElement, useState } from "react";
import { ApiCallResult, CurrencyPair } from "../../types/api.types";
import { useApiCall } from "../../hooks";
import { Tabs } from "./Tabs";
import { Banner } from "./Banner";
import { HistoricPrices } from "./HistoricPrices";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DEFAULT_CURRENCY_ID = "EURUSD";
const DEFAULT_CURRENCY_LABEL = "EUR-USD";

const pairsUri = `${import.meta.env.VITE_BASE_URL}/pairs`;

type CurrencyPairDataType = CurrencyPair[];

const Home = (): ReactElement => {
  const [currencyPair, setCurrencyPair] = useState<CurrencyPair>({
    id: DEFAULT_CURRENCY_ID,
    label: DEFAULT_CURRENCY_LABEL,
  });

  const { data, loading, error } =
    useApiCall<ApiCallResult<CurrencyPairDataType>>(pairsUri);

  const handleSelectCurrencyPair = (pair: CurrencyPair) => {
    setCurrencyPair(pair);
  };

  if (loading)
    return (
      <SkeletonTheme baseColor="#202020" highlightColor="#444" height="15rem">
        <Skeleton />
      </SkeletonTheme>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Tabs
        currencyPairs={(data as unknown as CurrencyPairDataType) || []}
        currencyPairId={currencyPair.id}
        onCurrencyPairChange={handleSelectCurrencyPair}
      />
      <Banner currencyPairId={currencyPair.id} />
      <HistoricPrices currencyPairId={currencyPair.id} />
    </>
  );
};

export default Home;
