import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import React from 'react'

function AppHeader() {
  return (
    <div className='w-full shadow p-3 flex items-center justify-between'>
        <SidebarTrigger />
        {/* AppHeader */}
        <Button>Sign In</Button>
    </div>
  )
}

export default AppHeader