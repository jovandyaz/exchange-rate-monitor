import { useCallback, useEffect, useRef } from "react";

export const useWebSocket = (
  url: string,
  onOpen: (event: Event) => void,
  onMessage: (event: MessageEvent) => void,
  onClose: (event: CloseEvent) => void,
  onError: (event: Event) => void
) => {
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const reconnectAttemptsRef = useRef<number>(0);
  const isConnectedRef = useRef<boolean>(false);

  const connectWebSocket = useCallback(() => {
    if (isConnectedRef.current) {
      return;
    }

    const socket = new WebSocket(url);
    webSocketRef.current = socket;

    socket.addEventListener("open", (event) => {
      isConnectedRef.current = true;
      onOpen(event);
    });
    socket.addEventListener("message", onMessage);
    socket.addEventListener("close", (event) => {
      isConnectedRef.current = false;
      onClose(event);
      reconnectWebSocket();
    });
    socket.addEventListener("error", (event) => {
      isConnectedRef.current = false;
      onError(event);
      reconnectWebSocket();
    });
  }, [onClose, onError, onMessage, onOpen, url]);

  const reconnectWebSocket = useCallback(() => {
    if (reconnectAttemptsRef.current < 5) {
      const reconnectTimeout = Math.pow(2, reconnectAttemptsRef.current) * 1000; // exponential backoff strategy.
      reconnectAttemptsRef.current++;
      clearInterval(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setInterval(() => {
        connectWebSocket();
      }, reconnectTimeout);
    } else {
      const socket = webSocketRef.current;
      if (socket) {
        socket.close();
      }
    }
  }, [connectWebSocket]);

  useEffect(() => {
    if (typeof url !== "string" || url.trim() === "") {
      throw new Error("Initial URL must be a non-empty string.");
    }

    connectWebSocket();

    return () => {
      clearInterval(reconnectTimeoutRef.current);
      const socket = webSocketRef.current;
      if (socket) {
        socket.removeEventListener("open", onOpen);
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("close", onClose);
        socket.removeEventListener("error", onError);

        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      }
    };
  }, [url, onOpen, onMessage, onClose, onError, connectWebSocket]);

  useEffect(() => {
    const socket = webSocketRef.current;
    if (socket) {
      socket.onclose = () => {
        isConnectedRef.current = false;
        reconnectWebSocket();
      };
    }
  }, [reconnectWebSocket]);

  useEffect(() => {
    const socket = webSocketRef.current;
    if (socket) {
      if (socket.url !== url) {
        socket.close();
        webSocketRef.current = null;
        clearInterval(reconnectTimeoutRef.current);
        reconnectAttemptsRef.current = 0;
        isConnectedRef.current = false;
        connectWebSocket();
      }
    }
  }, [connectWebSocket, url]);

  return { webSocketRef };
};
