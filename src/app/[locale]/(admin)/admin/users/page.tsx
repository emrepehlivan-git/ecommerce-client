import { getApiV1Users } from "@/api/generated/users/users";
import { UsersTable } from "@/components/admin/users/users-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Metadata } from "next";
import { Suspense } from "react";

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: "Users",
  description: "Users",
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  const page = Number(searchParams?.page ?? 1);
  const pageSize = Number(searchParams?.pageSize ?? 10);
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";

  return (
    <Suspense fallback={<UsersPageSkeleton />}>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">Users</h3>
        <UsersTable
          page={page}
          pageSize={pageSize}
          search={search}
        />
      </div>
    </Suspense>
  );
}

const UsersPageSkeleton = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <TableBody>
        {Array.from({ length: 5 }, (_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  );
};
