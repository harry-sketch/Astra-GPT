"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

export function SidebarFooterComponent() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { data, isPending } = useSession();

  const { data: subscriptionData, isPending: isSubsPending } =
    useSubscription();

  const { isMobile } = useSidebar();

  const isProUser = subscriptionData && !isSubsPending;

  const handleDisconnect = async () => {
    await signOut({
      callbackURL: "/sign-in",
      fetchOptions: {
        onRequest: () => setIsLoading(true),
        onError: (ctx) => {
          console.log(ctx.error.message);
          toast.error("Error while signing out");
          setIsLoading(false);
        },
        onSuccess: () => {
          router.push("/sign-in");
          toast.success("Signed out successfull");
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <SidebarMenu className="bg-[#2f2f2f] text-white">
      <SidebarMenuItem>
        {data?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                {isPending ? (
                  <div className="h-8! w-8! text-muted-foreground flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : (
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={data?.user.image ?? ""}
                      alt={data.user.name}
                    />
                    <AvatarFallback>
                      <Skeleton className="h-full w-full rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.user.name}</span>
                  <span className="truncate text-xs">{data.user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.image ?? ""}
                        alt={data.user.name}
                      />
                      <AvatarFallback>
                        <Skeleton className="h-full w-full rounded-full" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isProUser && (
                  <DropdownMenuItem className="bg-[#373669] border-[#3e3e4a] text-white !hover:bg-[#373669]/60 text-[12px] font-medium">
                    <Sparkles />
                    Pro Member
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/profile" className="cursor-pointer">
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.customer.portal();
                  }}
                >
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDisconnect}>
                <LogOut />
                {isLoading ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  "Log out"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
