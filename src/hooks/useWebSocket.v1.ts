import { useEffect } from "react";

export const useWebSocket = (
  url: string,
  handleOpen: (event: Event) => void,
  handleMessage: (event: MessageEvent) => void,
  handleOnClose: (event: CloseEvent) => void
) => {
  useEffect(() => {
    let socket: WebSocket | null = null;
    socket = new WebSocket(url);
    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleOnClose);

    return () => {
      socket?.close();
    };
  }, [url, handleOpen, handleMessage, handleOnClose]);
};
