import { ReactElement } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableHeader } from "./TableHeader";
import "./DataTable.css";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  noDataMessage?: string;
}

export const DataTable = <TData extends object>({
  columns,
  data,
  isLoading = false,
  noDataMessage = "No data to display",
}: DataTableProps<TData>): ReactElement => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="table-container">
      {table.getRowModel().rows.length === 0 ? (
        <h6>{noDataMessage}</h6>
      ) : (
        <>
          <table className="table">
            <TableHeader table={table} />
            <tbody className="table-body">
              {table.getRowModel().rows.map((row) => (
                <tr className="table-body_row" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="table-body_cell" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
