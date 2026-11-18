import { Search, LayoutGrid, Plus, Database } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { SidebarFooterComponent } from "./SidebarFooter";
import ThreadsLists from "./ThreadList";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#2f2f2f] border-none text-sidebar-foreground transition-all duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader className="px-2 pt-3.5 bg-[#2f2f2f]">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5 text-white">Astra-GPT</div>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger className="hover:bg-[#2f2f2f] text-[#b4b4b4] h-8 w-8 transition-colors bg-[#2f2f2f]" />
          </div>
        </div>
      </SidebarHeader>

      {/* REMOVED group-data-[collapsible=icon]:hidden from SidebarContent */}
      <SidebarContent className="px-1 mt-2 bg-[#2f2f2f]">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0">
            {[
              { title: "New chat", icon: Plus, href: "/" },
              { title: "Search", icon: Search, href: "/" },
              { title: "Images", icon: LayoutGrid, href: "/" },
              { title: "Memories", icon: Database, href: "/memories" },
            ].map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="flex justify-cente relative"
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "h-9 transition-colors text-[#ececec] hover:bg-[#2f2f2f] data-[state=open]:bg-[#2f2f2f]",
                    // Centering logic for collapsed state
                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="ml-3 text-[14px] font-normal group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                  <Link
                    href={item.href}
                    className="absolute inset-0 cursor-pointer"
                  ></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* <Suspense fallback={<Loader2 />}> */}
        <ThreadsLists />
        {/* </Suspense> */}
      </SidebarContent>

      <SidebarFooter className="bg-[#2f2f2f]">
        <SidebarFooterComponent />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
