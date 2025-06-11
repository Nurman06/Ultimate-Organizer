// resources/js/components/AppSidebar.tsx

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Folder, LayoutGrid, Shirt } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { roles: string[] } | null } }>().props;
    const roles: string[] = auth.user ? auth.user.roles || [] : [];

    let dashboardHref = '/dashboard';
    if (roles.includes('admin')) {
        dashboardHref = '/admin/dashboard';
    } else if (roles.includes('user')) {
        dashboardHref = '/user/dashboard';
    }

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardHref,
            icon: LayoutGrid,
        },
        // Hanya tampilkan untuk admin
        ...(roles.includes('admin')
            ? [
                  {
                      title: 'Manajemen Klien',
                      href: '/admin/klien',
                      icon: Folder,
                  },
                  // ! PERUBAHAN: Tambahkan menu baru di sini
                  {
                      title: 'Manajemen Baju Adat', // Nama menu baru
                      href: '/admin/baju-adat', // Sesuaikan dengan route Anda
                      icon: Shirt, // Gunakan icon baru
                  },
                  {
                      title: 'Timeline Kegiatan',
                      href: '/admin/timeline-kegiatan',
                      icon: Calendar, // Icon baru
                  },
              ]
            : []),

        //Hanya tampilkan untuk user
        ...(roles.includes('user')
            ? [
                  {
                      title: 'Katalog Baju Adat', // Judul menu
                      href: '/user/katalog-baju-adat', // Sesuaikan route
                      icon: Shirt, // Icon yang diimport
                  },

                  {
                      title: 'Progress Acara',
                      href: '/user/progress-acara',
                      icon: Calendar,
                  },

                  {
                      title: 'Jadwalkan Meeting',
                      href: '/user/jadwalkan-meeting',
                      icon: Calendar, // atau pilih icon lain dari lucide-react
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/Nurman06/Ultimate-Organizer',
            icon: Folder,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
