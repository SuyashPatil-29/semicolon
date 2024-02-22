import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import NavItem from "./NavItem"
import { cn } from "@/lib/utils"
import Link from "next/link"
import LogoutButton from "./LogoutButton"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { access } from "@prisma/client"

export async function MobileNavbar() {
  const session = await getServerSession(authOptions)
  return (
    <div className="md:hidden block text-gray-500 dark:text-white">
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="w-8 h-8" />
      </SheetTrigger>
      <SheetContent
          side="left"
          className="flex flex-col items-center justify-center gap-4"
        >
        <NavItem href="/dashboard" linkto="/dashboard">Dashboard</NavItem>
        {session?.user.access !== access.STUDENT && <NavItem href="/aiml-library" linkto="/aiml-library">Aiml Library</NavItem>}
        {session?.user && <LogoutButton />}
        {!session?.user && <Link href="/sign-in" className={cn(buttonVariants({variant: "ghost"}),"font-semibold w-[105px] ml-4")}>Sign In</Link>}
        </SheetContent>
    </Sheet>
    </div>
  )
}

