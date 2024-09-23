import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ScrollArea, Table } from "@mantine/core";
import { PiNoteBlankLight } from "react-icons/pi";

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, T>[];
  footer?: boolean;
}

export default function AppTable<T>({
  data,
  columns,
  footer = false,
}: Props<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="relative min-w-max">
      {data.length === 0 && (
        <div
          className="absolute w-full mt-14 text-center grid place-items-center"
          key="no-data"
        >
          <p className="font-bold">No Data</p>
          <PiNoteBlankLight className="text-5xl"/>
        </div>
      )}
      <ScrollArea>
        <Table verticalSpacing="sm">
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
          {footer && data.length > 0 && (
            <Table.Tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <Table.Tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <Table.Th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tfoot>
          )}
        </Table>
      </ScrollArea>
    </div>
  );
}
