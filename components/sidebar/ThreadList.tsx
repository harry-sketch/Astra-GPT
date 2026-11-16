"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchThreads } from "@/action";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

export function ThreadsLists() {
  const router = useRouter();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["threads"],
    queryFn: () => fetchThreads(),
  });

  if (isLoading) {
    return [1, 2, 3, 4, 5].map((i) => {
      return (
        <SidebarMenuItem
          key={i}
          className="group/item relative pointer-events-none"
        >
          <SidebarMenuButton
            className={cn(
              "h-9 rounded-lg transition-all px-3 pr-10 cursor-pointer",
              "hover:bg-transparent",
            )}
          >
            <Skeleton className="w-full h-full bg-[#212121]" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  }

  if (isError) {
    return (
      <SidebarGroup className="p-0 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-[12px] font-medium text-[#b4b4b4] px-3 mb-1 mt-4">
          Recent
        </SidebarGroupLabel>
        <SidebarMenu className="gap-0.5">
          Something went wrong {error.message}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="p-0 group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[12px] font-medium text-[#b4b4b4] px-3 mb-1 mt-4">
        Recent
      </SidebarGroupLabel>
      {data && data?.length > 0 ? (
        data.map(({ id, title }) => (
          <SidebarMenu className="gap-0.5 text-white" key={id}>
            <SidebarMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/c/${id}`)}
            >
              {title}
            </SidebarMenuItem>
          </SidebarMenu>
        ))
      ) : (
        <div className="text-white text-base font-medium">
          No Threads to display
        </div>
      )}
    </SidebarGroup>
  );
}

export default ThreadsLists;
