import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentsSkeleton() {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Skeleton className="h-7 w-44" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t [&>th]:py-3">
            <TableHead>User</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">More</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              {/* User */}
              <TableCell className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>

              {/* Order ID */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Gateway */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Amount */}
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>

              {/* Status */}
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>

              {/* Created */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* More */}
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-6" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
