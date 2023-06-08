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

  const handleOpen = (event: Event) => {
    const webSocket = event.target as WebSocket;
    webSocket.send(
      JSON.stringify({
        pair: currencyPairId,
        action: "subscribe",
      })
    );
  };

  const handleOnMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as WebsocketData;
      setWebsocketData(message);
    } catch (error: unknown) {
      // TODO: handle error
    }
  };

  const handleOnClose = (event: CloseEvent) => {
    const webSocket = event.target as WebSocket;
    webSocket.close();
  };

  const handleOnError = (event: Event) => {
    const webSocket = event.target as WebSocket;
    webSocket.onerror;
  };

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
  }, [getExchangeRates]);

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
