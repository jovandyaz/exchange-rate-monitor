import { Table, flexRender } from "@tanstack/react-table";

interface TableHeaderProps<T extends object> {
  table: Table<T>;
}

export const TableHeader = <T extends object>({
  table,
}: TableHeaderProps<T>): JSX.Element => {
  return (
    <thead className="table-head">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr className="table-head_row" key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <td className="table-head_cell" key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </td>
          ))}
        </tr>
      ))}
    </thead>
  );
};
