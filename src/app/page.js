'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useTheme } from 'next-themes'
import { Sun } from 'lucide-react'
import { AppSidebar } from '@/app/_components/Sidebar'

function page() {
  const { theme, setTheme } = useTheme()
  return (
    <div className='w-full'>
      <AppSidebar />
    </div>
  )
}

export default page