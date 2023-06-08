import "./Card.css";

interface CardProps {
  title: string;
  value: string | number;
}

export const Card = ({ title, value }: CardProps): JSX.Element => {
  return (
    <div className="card">
      <h1 className="title">{title}</h1>
      <h2 className="value">{value}</h2>
    </div>
  );
};
