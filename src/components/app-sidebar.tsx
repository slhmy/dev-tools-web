import * as React from "react"
import { NavLink } from "react-router-dom"
import { WrenchIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Encoding",
    items: [{ title: "Base64", url: "/base64" }],
  },
  {
    title: "Date & Time",
    items: [{ title: "Timestamp", url: "/timestamp" }],
  },
  {
    title: "Storage",
    items: [{ title: "Gist", url: "/gist" }],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <WrenchIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Dev Tools</span>
                  <span className="text-xs text-muted-foreground">
                    v{APP_VERSION}
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((group) => (
              <SidebarMenuItem key={group.title}>
                <SidebarMenuButton asChild>
                  <span className="font-medium">{group.title}</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {group.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            isActive ? "font-medium text-foreground" : ""
                          }
                        >
                          {item.title}
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

