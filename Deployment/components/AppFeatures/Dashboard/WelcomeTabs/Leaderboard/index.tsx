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
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { formatAddr } from "@/utilities"
import { Address, Point } from "@/interfaces"
import { useAccount } from "wagmi"
import SelectComponent from "../SelectComponent";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";

const getColumns = () => {
    const columns: ColumnDef<Point>[] = [
      {
        accessorKey: "user",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Users
              <ArrowUpDown />
            </Button>
          )
        },
        cell: ({ row }) => (
            <div className="place-items-center">
                <AddressWrapper 
                    account={formatAddr(row.getValue("user")?.toString())}
                    display={false}
                    size={3}
                />
            </div>
        )
      },
      {
        accessorKey: "creator",
        header: "Creator",
        cell: ({ row }) => (
            <div className="font-medium text-center">{row.getValue("creator")?.toString()}</div>
        ),
      },
      {
        accessorKey: "contributor",
        header: () => <div className="text-center">Contributor</div>,
        cell: ({ row }) => (<div className="text-center font-medium">{row.getValue("contributor")?.toString()}</div>),
      },
      {
        accessorKey: "referrals",
        header: () => <div className="text-center">Referrals</div>,
        cell: ({ row }) => (
            <div className="text-center font-medium">{row.getValue("referrals")?.toString()}</div>
        ),
      }
    ];
    return columns;
    
}

export default function Leaderboard() {
    const { points } = useAppStorage();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [displayedPoints, setPoints] = React.useState<Point[]>(points[0].value!);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const currentUser = formatAddr(useAccount().address);

    const columns = getColumns();
    const table = useReactTable({
        data: displayedPoints,
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
    });

    const callback = (arg: Address | string) => {
        setPoints(() => {
            const filtered = points.filter(({key}) => key === arg);
            return filtered[0].value!;
        })
    }

    return (
        <div className="w-full">
            <SelectComponent data='phases' callback={callback} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by user..."
                    value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("slot")?.setFilterValue(event.target.value)
                    }
                    className="w-[80%] max-w-xs"
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
                                className={`${formatAddr(row.getValue('user')?.toString()) === currentUser && 'bg-gray1/30'} hover:bg-none`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-center ">
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
