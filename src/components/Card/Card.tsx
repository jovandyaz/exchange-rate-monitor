import "./Card.css";

interface CardProps {
  className?: string;
  title: string;
  value: string | number;
}

export const Card = ({ className, title, value }: CardProps): JSX.Element => {
  return (
    <div className="card">
      <h1 className="title">{title}</h1>
      <h2 className={`value ${className}`}>{value}</h2>
    </div>
  );
};
