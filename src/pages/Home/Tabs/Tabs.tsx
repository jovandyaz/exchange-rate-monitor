
import { ReactElement } from "react";
import { Tab } from "../../../components";
import { CurrencyPair } from "../../../types/api.types";
import "./tabs.css";

interface TabsProps {
  currencyPairs: CurrencyPair[];
  currencyPairId: string;
  onCurrencyPairChange: (pair: CurrencyPair) => void;
}

export const Tabs = ({
  currencyPairs,
  currencyPairId,
  onCurrencyPairChange,
}: TabsProps): ReactElement => {
  return (
    <section className="tabs">
      {!!currencyPairs.length &&
        currencyPairs.map(({ id, label }) => (
          <Tab
            key={id}
            label={label}
            selected={id === currencyPairId}
            onClick={() => onCurrencyPairChange({ id, label })}
          />
        ))}
    </section>
  );
};
