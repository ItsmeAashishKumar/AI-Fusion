'use client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { Button } from '@/components/ui/button'
function AppHeader() {
  return (
    <div className='w-full p-2 flex justify-between border-b shadow-sm'>
        <SidebarTrigger/>
        <Button>
            Sign In
        </Button>
    </div>
  )
}

export default AppHeader