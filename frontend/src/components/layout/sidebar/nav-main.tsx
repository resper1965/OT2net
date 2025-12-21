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
  Workflow,
  BookOpen,
  ChevronRight,
  Settings,
  Shield,
  Target,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname, useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { type Resource, type PermissionAction } from "@/hooks/usePermissions";

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
        title: "Organizações",
        href: "/dashboard/organizacoes",
        icon: Building2,
        requiredPermission: { resource: 'organizacoes', action: 'read' }
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
        title: "Equipe & Stakeholders",
        href: "/dashboard/equipe",
        icon: Users,
        requiredPermission: { resource: 'membros-equipe', action: 'read' }
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
  const params = useParams(); // Hook to get URL parameters
  const { isMobile } = useSidebar();
  
  // Check if we are inside a project context
  const projectId = params?.id;
  const isProjectContext = !!projectId && pathname.startsWith(`/dashboard/projetos/${projectId}`);

  // Define Project-Speciifc Navigation
  const projectNavItems: NavGroup[] = isProjectContext ? [
    {
      title: "Navegação",
      items: [
        {
          title: "Voltar ao Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Visão Geral",
          href: `/dashboard/projetos/${projectId}`,
          icon: FolderKanban,
        }
      ]
    },
    {
      title: "Fase 0: Discovery",
      items: [
        {
          title: "Levantamento & AS-IS",
          href: `/dashboard/projetos/${projectId}/fase/fase0`,
          icon: Workflow,
        }
      ]
    },
    {
      title: "Fase 1: Assessment",
      items: [
         {
          title: "Análise & Cross-check",
          href: `/dashboard/projetos/${projectId}/fase/fase1`,
          icon: Shield,
        }
      ]
    },
    {
       title: "Fase 2: Planejador",
       items: [
         {
           title: "Plano Diretor (Roadmap)",
           href: `/dashboard/projetos/${projectId}/fase/fase2`,
           icon: Target,
         }
       ]
    },
    {
       title: "Fase 3: Monitoramento",
       items: [
         {
           title: "PMO & Indicadores",
           href: `/dashboard/projetos/${projectId}/fase/fase3`,
           icon: LineChart,
         }
       ]
    }
  ] : [];

  // Toggle between Global and Project menus
  const currentNavItems = isProjectContext ? projectNavItems : navItems;
  
  // Apply permission filtering if needed (currently bypassed as per original code)
  const filteredNavItems = currentNavItems; 

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
                                className="hover:text-foreground active:text-foreground hover:bg-primary/10! active:bg-primary/10!"
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
                            className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
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
                                  className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
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
                      className="hover:text-foreground active:text-foreground hover:bg-primary/10 active:bg-primary/10"
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


