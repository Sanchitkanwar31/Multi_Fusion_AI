import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'   
import { AppSidebar } from './_components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import { SidebarTrigger } from '@/components/ui/sidebar-trigger'

function Provider({children, ...props}) {
  return (
    <NextThemesProvider {...props}
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >

        <SidebarProvider>
            <AppSidebar/>
            <SidebarTrigger/>
            <div>{children}</div>
        </SidebarProvider>
    </NextThemesProvider>  
  )
}

export default Provider