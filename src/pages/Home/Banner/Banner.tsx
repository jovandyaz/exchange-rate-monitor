import { ReactElement, useCallback, useEffect, useState } from "react";
import { useWebSocket } from "../../../hooks";
import { WebsocketData } from "../../../types/api.types";
import { Card } from "../../../components";
import { stringOrNumber } from "../../../types/global.types";
import "./Banner.css";

interface BannerProps {
  currencyPairId: string;
  openPrice: stringOrNumber;
}

const webSocketUri = import.meta.env.VITE_WEBSOCKET_URL;

const stringifyMessage = (currencyPairId: string, action: string) =>
  JSON.stringify({
    pair: currencyPairId,
    action,
  });

const Banner = ({ currencyPairId, openPrice }: BannerProps): ReactElement => {
  const [currentExchangeRate, setCurrentExchangeRate] = useState<number>(0);
  const [highestExchangeRate, setHighestExchangeRate] = useState<number>(0);
  const [lowestExchangeRate, setLowestExchangeRate] = useState<number>(0);
  const [websocketData, setWebsocketData] = useState<WebsocketData>({
    currency: "",
    detail: "",
    message: "",
    point: 0,
  });

  const subscribe = useCallback(
    (socket: WebSocket | null, currencyPairId: string) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(stringifyMessage(currencyPairId, "subscribe"));
      }
    },
    []
  );

  const unsubscribe = useCallback(
    (socket: WebSocket | null, currencyPairId: string) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(stringifyMessage(currencyPairId, "unsubscribe"));
      }
    },
    []
  );

  const handleOpen = useCallback(
    (event: Event) => {
      const webSocket = event.target as WebSocket;
      subscribe(webSocket, currencyPairId);
    },
    [currencyPairId, subscribe]
  );

  const handleOnMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as WebsocketData;
      setWebsocketData(message);
    } catch (error) {
      console.error("Failed to parse WebSocket data:", error);
    }
  }, []);

  const handleOnClose = useCallback(
    (event: CloseEvent) => {
      const webSocket = event.target as WebSocket;
      if (webSocket?.readyState === WebSocket.CLOSED) {
        webSocket.close();
        unsubscribe(webSocket, currencyPairId);
      }
    },
    [currencyPairId, unsubscribe]
  );

  const handleOnError = useCallback((event: Event) => {
    const webSocket = event.target as WebSocket;
    console.error("WebSocket error:", webSocket.onerror);
  }, []);

  useWebSocket(
    webSocketUri,
    handleOpen,
    handleOnMessage,
    handleOnClose,
    handleOnError
  );

  const getExchangeRates = useCallback(() => {
    if (!websocketData.point) return;

    if (!currentExchangeRate) {
      setCurrentExchangeRate(websocketData.point);
      setLowestExchangeRate(websocketData.point);
      setHighestExchangeRate(websocketData.point);
    } else if (websocketData.point > highestExchangeRate) {
      setHighestExchangeRate(websocketData.point);
    } else if (websocketData.point < lowestExchangeRate) {
      setLowestExchangeRate(websocketData.point);
    }

    setCurrentExchangeRate(websocketData.point);
  }, [
    currentExchangeRate,
    highestExchangeRate,
    lowestExchangeRate,
    websocketData.point,
  ]);

  useEffect(() => {
    getExchangeRates();

    return () => {
      handleOnClose(new CloseEvent("close"));
    };
  }, [currencyPairId, getExchangeRates, handleOnClose]);

  return (
    <section className="banner-container">
      <Card title="Currency Pair" value={currencyPairId} />
      <Card
        className={`${currentExchangeRate > +openPrice ? "up" : "down"}`}
        title="Current Exchange-Rate Value"
        value={currentExchangeRate.toFixed(4)}
      />
      <Card
        title="Higest Exchange-Rate Today"
        value={highestExchangeRate.toFixed(4)}
      />
      <Card
        title="Lowest Exchange-Rate Today"
        value={lowestExchangeRate.toFixed(4)}
      />
      <Card
        title="Last Update (UTC)"
        value={new Date().toLocaleString("en-US", {
          timeZone: "UTC",
        })}
      />
    </section>
  );
};

export default Banner;
