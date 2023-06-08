import { createColumnHelper } from "@tanstack/react-table";
import {
  HighLowDataTypes,
  OpenCloseDataTypes,
} from "../../../types/global.types";

const columnHelper = createColumnHelper<
  HighLowDataTypes | OpenCloseDataTypes
>();

export const HighLowColumns = [
  columnHelper.accessor("date", {
    id: "date",
    header: "Date",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("high", {
    id: "high",
    header: () => "High",
    cell: (info) => (
      <span key={info.column.id}>{info.renderValue() as React.ReactNode}</span>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("low", {
    id: "low",
    header: () => "Low",
    cell: (info) => (
      <span key={info.column.id}>{info.renderValue() as React.ReactNode}</span>
    ),
    footer: (info) => info.column.id,
  }),
];

export const OpenCloseColumns = [
  columnHelper.accessor("date", {
    id: "date",
    header: "Date",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("open", {
    id: "open",
    header: () => "Open",
    cell: (info) => (
      <span key={info.column.id}>{info.renderValue() as React.ReactNode}</span>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("close", {
    id: "close",
    header: () => "Close",
    cell: (info) => (
      <span key={info.column.id}>{info.renderValue() as React.ReactNode}</span>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("difference", {
    id: "difference",
    header: () => "Difference",
    cell: (info) => (
      <span
        className={`${(info.renderValue() as number) > 0 ? "green" : "red"}`}
        key={info.column.id}
      >
        {info.renderValue() as React.ReactNode}
      </span>
    ),
    footer: (info) => info.column.id,
  }),
];
