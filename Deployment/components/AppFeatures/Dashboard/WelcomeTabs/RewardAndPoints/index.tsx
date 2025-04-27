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
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Address, Point, PointsReturnValue } from "@/interfaces"
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage"
import { useAccount } from "wagmi"
import { formatAddr } from "@/utilities"
import SelectComponent from "../SelectComponent"

const getColumns = () => {
    const columns: ColumnDef<Point>[] = [
      {
        accessorKey: "creator",
        header: () => <div className="text-center">Creator</div>,
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
        header: () => <div className="text-right">Referrals</div>,
        cell: ({ row }) => (<div className="text-center font-medium">{row.getValue("referrals")?.toString()}</div>),
      },
    ];
    return columns;
    
}

function getUserPoints(account: Address, points: PointsReturnValue[], phase: string) {
    const filteredPhase = points.filter(({key}) => key === phase);
    const filteredPoints = filteredPhase[0]?.value?.filter(({user}) => user === account);
    return filteredPoints;
}

export default function RewardAndPoints() {
    const [phase, setPhase] = React.useState<string>('beta');
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const account = formatAddr(useAccount().address);
    const points = getUserPoints(account, useAppStorage().points, phase);

    const columns = getColumns();
    const callback = (arg: Address | string) => setPhase(arg);
    
    const table = useReactTable({
        data: points!,
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
                <SelectComponent callback={callback} />
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
