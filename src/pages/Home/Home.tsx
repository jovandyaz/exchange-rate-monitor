import { ReactElement, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ApiCallResult, CurrencyPair } from "../../types/api.types";
import { useApiCall } from "../../hooks";
import { Tabs } from "./Tabs";
import ExchangeRateView from "./ExchangeRateView/ExchangeRateView";
import "react-loading-skeleton/dist/skeleton.css";
import { ErrorMessage } from "../../components";

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

  if (error)
    return (
      <ErrorMessage message={"An error occurred. Reload the page, please."} />
    );
  return (
    <>
      <Tabs
        currencyPairs={(data as unknown as CurrencyPairDataType) || []}
        currencyPairId={currencyPair.id}
        onCurrencyPairChange={handleSelectCurrencyPair}
      />
      <ExchangeRateView currencyPairId={currencyPair.id} />
    </>
  );
};

export default Home;
