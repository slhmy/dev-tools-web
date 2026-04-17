import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Base64Page } from "@/pages/base64"
import { GistPage } from "@/pages/gist"
import { HomePage } from "@/pages/home"
import { QRCodePage } from "@/pages/qrcode"
import { StringLengthPage } from "@/pages/string-length"
import { TimestampPage } from "@/pages/timestamp"

export function App() {
  return (
    <>
      <BrowserRouter basename="/dev-tools-web">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/base64" element={<Base64Page />} />
                <Route path="/timestamp" element={<TimestampPage />} />
                <Route path="/gist" element={<GistPage />} />
                <Route path="/qrcode" element={<QRCodePage />} />
                <Route path="/string-length" element={<StringLengthPage />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </BrowserRouter>
      <Toaster richColors />
    </>
  )
}

export default App
