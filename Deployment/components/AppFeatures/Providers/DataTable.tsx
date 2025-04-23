"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper"
import { formatAddr, formatValue, toBigInt, toBN } from "@/utilities"
import { GetColumnArgs, ProviderResult } from "@/interfaces"
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage"

const getColumns = ({currentUser, providerSlots, onCheckboxClicked } : GetColumnArgs) => {
    const columns: ColumnDef<ProviderResult>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={providerSlots.includes(toBigInt(row.getValue('slot') ||'0'))}
            // checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "slot",
        header: "Slot",
        cell: ({ row }) => (
            <div className="font-bold text-white1">{row.getValue("slot")?.toString()}</div>
        ),
      },
      {
        accessorKey: "account",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Address
              <ArrowUpDown />
            </Button>
          )
        },
        cell: ({ row }) => <div>
            <AddressWrapper 
                account={row.getValue("account")}
                display
                size={4}
            />
        </div>,
      },
      {
        accessorKey: "rate",
        header: () => <div className="text-right">Rate</div>,
        cell: ({ row }) => {
          const rate = toBN(row.getValue("rate")).div(100).toString()
          return <div className="text-right font-medium">{`${rate}%`}</div>
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = formatValue(row.getValue("amount")).toNum
    
          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
    
          return <div className="text-right font-medium">{formatted}</div>
        },
      },
      // {
      //   id: "actions",
      //   enableHiding: false,
      //   cell: ({ row }) => {
      //     const account = row.getValue('account') as string;
      //     const disabled = account.toLowerCase() !== currentUser.toLowerCase();
      //     const slot = toBigInt(row.getValue("slot")?.toString());
      //     const amount = toBigInt(row.getValue("amount")?.toString());
    
      //     return (
      //       <DropdownMenu>
      //         <DropdownMenuTrigger asChild>
      //           <Button variant="ghost" className="h-8 w-8 p-0">
      //             <span className="sr-only">Open menu</span>
      //             <MoreHorizontal />
      //           </Button>
      //         </DropdownMenuTrigger>
      //         <DropdownMenuContent align="end" className="p-2">
      //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
      //               <DropdownMenuItem
      //                   disabled={disabled}
      //                   onClick={() => onCheckboxClicked(slot, amount)}
      //               >
      //                   unSelect
      //               </DropdownMenuItem>
      //               <DropdownMenuItem
      //                   disabled={disabled}
      //                   onClick={() => onCheckboxClicked(slot, amount)}
      //               >
      //                   Select
      //               </DropdownMenuItem>
      //         </DropdownMenuContent>
      //       </DropdownMenu>
      //     )
      //   },
      // },
    ];
    return columns;
    
}

export default function DataTable({getColumnArgs} : DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const { providers } = useAppStorage();

    const columns = getColumns(getColumnArgs);
    const table = useReactTable({
        data: providers,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection, },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by slot..."
                    value={(table.getColumn("slot")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("slot")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {
                            table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                }
                            )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={() => {
                                  const slot = toBigInt(row.getValue('slot')?.toString());
                                  const amount = toBigInt(row.getValue('amount')?.toString());
                                  getColumnArgs.onCheckboxClicked(slot, amount);
                                }}
                                className="cursor-pointer"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell 
                                      key={cell.id}
                                    
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                            ))
                        ) : (
                        <TableRow>
                            <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                            >
                            No results.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
                </div>
            </div>
        </div>
    )
}

type DataTableProps = {
    // data: ProviderResult[];
    getColumnArgs: GetColumnArgs;
}