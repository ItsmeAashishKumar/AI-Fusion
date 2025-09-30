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
import { Moon, Sun, Plus, Zap, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignInButton, useUser } from "@clerk/nextjs"
import Progressbar from "./Progressbar"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/config/FirebaseDb"
import { useEffect, useState } from "react"
import moment from "moment"
import Link from "next/link"
import axios from "axios"

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const [chatHistory, setChatHistory] = useState([])
  const [freeMsgCount,setFreeMsgCount]=useState(0)

  const getChatHistory = async () => {
    try {
      const q = query(
        collection(db, "chatHistory"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
      )
      const querySnapshot = await getDocs(q)

      const chats = []
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data())
        chats.push(doc.data())
      })
      setChatHistory(chats)
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  const getLastUserMessageFromChat = (chat) => {
    try {
      const allMessages = Object.values(chat.messages || {}).flat()
      const userMessages = allMessages.filter(msg => msg.role === 'user')

      if (userMessages.length === 0) {
        return {
          chatId: chat.chatId,
          message: "No messages yet",
          lastMgDate: moment(chat.lastUpdated || Date.now()).fromNow()
        }
      }

      const lastUserMsg = userMessages[userMessages.length - 1].content || "No content"
      const lastUpdated = chat.lastUpdated || Date.now()
      const formattedDate = moment(lastUpdated).fromNow()

      return {
        chatId: chat.chatId,
        message: lastUserMsg,
        lastMgDate: formattedDate
      }
    } catch (error) {
      console.error("Error parsing chat:", error)
      return {
        chatId: chat.chatId,
        message: "Error loading message",
        lastMgDate: ""
      }
    }
  }

  useEffect(() => {
    if (user) {
      getChatHistory()
      GetRemainingTokenMsgs()
    }
  }, [user])

  const GetRemainingTokenMsgs=async()=>{
    const result=await axios.get('/api/user-remaining-msg')
    console.log("token",result)
    setFreeMsgCount(result?.data?.remainingToken)
  }

  return (
    <Sidebar className="bg-background shadow-md flex flex-col h-screen">
      {/* Fixed Header */}
      <SidebarHeader className="border-b px-4 py-3 flex-shrink-0">
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

      {/* Scrollable Content */}
      <SidebarContent className="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
        {/* Fixed New Chat Button */}
        <div className="flex-shrink-0">
          {!user ?
            (
              <SignInButton>
                <Button size="lg" className="cursor-pointer w-full justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </SignInButton>
            ) : (
              <Link href={'/'}>
                <Button size="lg" className="cursor-pointer w-full justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </Link>

            )}
        </div>

        {/* Scrollable Chat History */}
        <SidebarGroup className="flex-1 scrollbar-hide overflow-y-auto">
          <div className="flex flex-col">
            <p className="text-lg font-bold mb-2">Chats</p>
            {!user && (
              <p className="text-sm text-gray-600">
                Sign in to start chatting with multiple AI models
              </p>
            )}
            {chatHistory.length === 0 && user && (
              <p className="text-sm text-gray-400 mt-2">No chats yet</p>
            )}

            {/* Chat History List */}
            <div className="space-y-1">
              {chatHistory.map((chat, index) => {
                const chatData = getLastUserMessageFromChat(chat)
                return (
                  <Link href={`?chatId=` + chat.chatId} key={index} className="">
                    <div
                      key={index}
                      className="px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h2 className="text-xs text-gray-400 mb-1">{chatData.lastMgDate}</h2>
                      <h2 className="text-sm line-clamp-2 text-gray-700 dark:text-gray-300">
                        {chatData.message}
                      </h2>
                    </div>
                  </Link>

                )
              })}
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Footer */}
      <SidebarFooter className="border-t p-4 text-sm text-muted-foreground flex-shrink-0">
        {!user ? (
          <SignInButton mode="modal">
            <Button className="w-full">Sign In/Sign Up</Button>
          </SignInButton>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <Progressbar remainingToken={freeMsgCount}/>
            <div className="w-full">
              <Button className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
            <Button variant="ghost" className="w-full flex justify-center items-center gap-2">
              <User className="h-4 w-4" />
              Settings
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}