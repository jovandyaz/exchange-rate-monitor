export type stringOrNumber = string | number;

export interface HighLowDataTypes {
  id: stringOrNumber;
  date: stringOrNumber;
  high: stringOrNumber;
  low: stringOrNumber;
}

export interface OpenCloseDataTypes {
  id: stringOrNumber;
  date: stringOrNumber;
  open: stringOrNumber;
  close: stringOrNumber;
  difference: stringOrNumber;
}

export interface ChartDataTypes {
  id: stringOrNumber;
  date: stringOrNumber;
  rate: stringOrNumber;
}
