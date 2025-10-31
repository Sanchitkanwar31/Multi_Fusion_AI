import React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'   
import { AppSidebar } from './_components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppHeader from './_components/AppHeader'
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
        
            <div className='w-full'>
                <AppHeader/>{children}
            </div>
        </SidebarProvider>
    </NextThemesProvider>  
  )
}

export default Provider