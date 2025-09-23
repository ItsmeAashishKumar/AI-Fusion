import { GeistSans, GeistMono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/Sidebar";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";



export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <div className="flex min-h-screen w-full overflow-hidden">
                <AppSidebar />
                <main className="flex-1 flex flex-col min-w-0">
                  <Provider>{children}</Provider>
                </main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}