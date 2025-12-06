"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Factory,
  MapPin,
  FolderKanban,
  Users,
  UserCog,
  Workflow,
  BookOpen,
  ChevronRight,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePermissions, type Resource, type PermissionAction } from "@/hooks/usePermissions";

type NavGroup = {
  title: string;
  items: NavItem;
};

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  requiredPermission?: { resource: Resource | string; action: PermissionAction };
  requiredRoles?: string[];
  items?: NavItem;
}[];

export const navItems: NavGroup[] = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
      }
    ]
  },
  {
    title: "Gestão",
    items: [
      {
        title: "Clientes",
        href: "/dashboard/clientes",
        icon: Building2,
        requiredPermission: { resource: 'clientes', action: 'read' }
      },
      {
        title: "Empresas",
        href: "/dashboard/empresas",
        icon: Factory,
        requiredPermission: { resource: 'empresas', action: 'read' }
      },
      {
        title: "Localidades",
        href: "/dashboard/sites",
        icon: MapPin,
        requiredPermission: { resource: 'localidades', action: 'read' }
      },
      {
        title: "Projetos",
        href: "/dashboard/projetos",
        icon: FolderKanban,
        requiredPermission: { resource: 'projetos', action: 'read' }
      }
    ]
  },
  {
    title: "Processos",
    items: [
      {
        title: "Coleta de Processos",
        href: "/dashboard/processos",
        icon: Workflow,
        requiredPermission: { resource: 'coleta-processos', action: 'read' },
        items: [
          { title: "Listar Coletas", href: "/dashboard/processos" },
          { title: "Nova Coleta", href: "/dashboard/processos/novo" }
        ]
      },
      {
        title: "Catálogo de Processos",
        href: "/dashboard/catalogo",
        icon: BookOpen,
        requiredPermission: { resource: 'catalogo', action: 'read' }
      }
    ]
  },
  {
    title: "Equipe",
    items: [
      {
        title: "Membros da Equipe",
        href: "/dashboard/equipe",
        icon: Users,
        requiredPermission: { resource: 'equipe', action: 'read' }
      },
      {
        title: "Partes Interessadas",
        href: "/dashboard/stakeholders",
        icon: UserCog,
        requiredPermission: { resource: 'partes-interessadas', action: 'read' }
      }
    ]
  },
  {
    title: "Administração",
    items: [
      {
        title: "Usuários",
        href: "/dashboard/usuarios",
        icon: Users,
        requiredRoles: ['ADMIN', 'AUDITOR']
      },
      {
        title: "Configurações",
        href: "/dashboard/conta",
        icon: Settings,
        requiredPermission: { resource: 'configuracoes', action: 'read' }
      }
    ]
  }
];

export function NavMain() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { can, role } = usePermissions();
  
  /**
   * Filtra itens do menu baseado nas permissões do usuário
   */
  const filterItemsByPermission = (items: NavItem): NavItem => {
    return items.filter(item => {
      // Se tem requiredRoles, verifica se o role do usuário está na lista
      if (item.requiredRoles && role) {
        if (!item.requiredRoles.includes(role)) {
          return false;
        }
      }
      
      // Se tem requiredPermission, verifica permissão
      if (item.requiredPermission) {
        const { resource, action } = item.requiredPermission;
        if (!can(resource, action)) {
          return false;
        }
      }
      
      // Filtra sub-itens recursivamente
      if (item.items) {
        item.items = filterItemsByPermission(item.items);
        // Se não sobrou nenhum sub-item, remove o item pai
        if (item.items.length === 0) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  /**
   * Filtra grupos do menu, removendo grupos vazios
   */
  /**
   * Filtra grupos do menu, removendo grupos vazios
   * TODO: Reativar filtro de permissões quando o sistema de roles estiver 100%
   */
  const filteredNavItems = navItems; // .map(group => ({ ...group, items: filterItemsByPermission(group.items) })).filter(group => group.items.length > 0);

  return (
    <>
      {filteredNavItems.map((nav) => (
        <SidebarGroup key={nav.title}>
          <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-48 rounded-lg">
                            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                            {item.items?.map((subItem) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                asChild
                                key={subItem.title}>
                                <Link href={subItem.href}>{subItem.title}</Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible
                        className="group/collapsible block group-data-[collapsible=icon]:hidden"
                        defaultOpen={!!item.items.find((s) => s.href === pathname)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.items?.map((subItem, key) => (
                              <SidebarMenuSubItem key={key}>
                                <SidebarMenuSubButton
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                                  isActive={pathname === subItem.href}
                                  asChild>
                                  <Link href={subItem.href} target={subItem.newTab ? "_blank" : ""}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      asChild>
                      <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {!!item.isComing && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                      Em breve
                    </SidebarMenuBadge>
                  )}
                  {!!item.isNew && (
                    <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                      Novo
                    </SidebarMenuBadge>
                  )}
                  {!!item.isDataBadge && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground">
                      {item.isDataBadge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}


