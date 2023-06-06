import { AxiosError, AxiosRequestConfig } from "axios";
import { stringOrNumber } from "./global.types";

export interface ApiCallResult<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  executeRequest: (newUrl: string, newConfig?: AxiosRequestConfig) => void;
}

export interface CurrencyPair {
  id: string;
  label: string;
}

export interface WebsocketData {
  currency: string;
  detail: string;
  message: string;
  point: number;
}

export interface HistoricData {
  "Meta Data": {
    "1. Information": string;
    "2. From Symbol": string;
    "3. To Symbol": string;
    "4. Output Size": string;
    "5. Last Refreshed": string;
    "6. Time Zone": string;
  };
  "Time Series FX (Daily)": {
    [date: string]: {
      "1. open": stringOrNumber;
      "2. high": stringOrNumber;
      "3. low": stringOrNumber;
      "4. close": stringOrNumber;
    };
  };
}
