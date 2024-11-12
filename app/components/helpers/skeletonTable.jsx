import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton"

export default function SkeletonTable() {
    return (
        <TableRow>
                <TableCell>
                  <Skeleton className="w-1/2 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-5 bg-gray-200" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-1/2 h-5 bg-gray-200" />
                </TableCell>
        </TableRow>
    )
}