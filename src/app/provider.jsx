'use client'
import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/app/_components/Sidebar'
import { ThemeProvider as NextThemesProvider } from "next-themes"

function Provider({ children, ...props }) {
    return (
        <NextThemesProvider {...props}>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />{children}
                </main>
            </SidebarProvider>
        </NextThemesProvider>

    )
}

export default Provider