import "./Card.css";

interface CardProps {
  title: string;
  value: string | number;
}

export const Card = ({ title, value }: CardProps): JSX.Element => {
  return (
    <div className="card">
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
};
