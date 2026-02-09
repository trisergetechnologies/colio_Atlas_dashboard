import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SessionsSkeleton() {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>{"Voice (per min)"}</TableHead>
            <TableHead>{"Video (per min)"}</TableHead>
            <TableHead>Upload Avatar</TableHead>
            <TableHead className="text-right">Average Rating</TableHead>
            <TableHead className="text-right">Edit</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              {/* Name + Avatar */}
              <TableCell className="flex items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Email */}
              <TableCell>
                <Skeleton className="h-4 w-36" />
              </TableCell>

              {/* Voice */}
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>

              {/* Video */}
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>

              {/* Upload Avatar */}
              <TableCell>
                <Skeleton className="h-9 w-9 rounded-md" />
              </TableCell>

              {/* Rating */}
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-10" />
              </TableCell>

              {/* Edit */}
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-8 rounded-md" />
              </TableCell>

              {/* Details */}
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
