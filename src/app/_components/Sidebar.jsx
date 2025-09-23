'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Moon, Sun, Plus, MessageSquare, Zap, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignIn, SignInButton, useUser } from "@clerk/nextjs"
import Progressbar from "./Progressbar"

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()

  return (
    <Sidebar className="bg-background shadow-md">

      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Image
                src="/logo1.svg"
                alt="logo"
                width={40}
                height={40}
                className="w-8 h-8"
              />
            </div>
            <p className="text-lg font-semibold">AI Fusion</p>
          </div>


          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </SidebarHeader>


      <SidebarContent className="px-4 py-3 space-y-0 ">
        {!user ?
          <SignInButton>
            <Button
              size="lg"
              className="w-full justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </SignInButton>

          :
          <Button
            size="lg"
            className="w-full justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        }



        <SidebarGroup className="space-y-0">
          <div className="flex flex-col  justify-center">
            <p className="text-lg font-bold">Chat</p>
            {!user && <p className="text-sm text-gray-600">Sign in to start chatting with multiple AI model</p>}
          </div>

        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter className="border-t p-4 text-sm text-muted-foreground">
        {!user ?
          <SignInButton mode="modal">
            <Button className={'w-full'}>
              Sign In/Sign Up
            </Button>
          </SignInButton>
          :
          <div className="w-full flex flex-col gap-3">
            <Progressbar />
            <div className="w-full"><Button className={'w-full'}><Zap />Upgrade Plan</Button></div>
            <Button
              variant={'ghost'}
              className="w-full flex justify-center items-center gap-4">
              <User />Settings</Button>
          </div>
        }

      </SidebarFooter>
    </Sidebar>
  )
}
