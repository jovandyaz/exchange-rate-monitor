import { useRef, useEffect } from "react";

export const useWebSocket = (
  uri: string,
  onOpen: (event: Event) => void,
  onMessage: (event: MessageEvent) => void,
  onClose: (event: CloseEvent) => void,
  onError: (event: Event) => void
) => {
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(uri);
    webSocketRef.current = socket;

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("close", onClose);
    socket.addEventListener("error", onError);

    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("close", onClose);
      socket.removeEventListener("error", onError);

      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [uri, onOpen, onMessage, onClose, onError]);

  return { webSocketRef };
};
