import "./ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps): JSX.Element => {
  return <label className="error-message">{message}</label>;
};
