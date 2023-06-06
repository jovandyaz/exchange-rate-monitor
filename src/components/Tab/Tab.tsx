interface TabProps {
  label: string;
  selected: boolean;
  onClick?: () => void;
}

export const Tab = ({ label, selected, onClick }: TabProps): JSX.Element => {
  return (
    <label className={`tab ${selected ? "active" : ""}`} onClick={onClick}>
      {label}
    </label>
  );
};
