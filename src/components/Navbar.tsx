import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { ModeToggle } from './ThemeToggleButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LogoutButton from './LogoutButton'
import { access } from '@prisma/client'
import NavItem from './NavItem'


const Navbar = async () => {
const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <div className="w-full fixed z-1000 top-0 left-0 dark:bg-[rgb(35,35,35)] bg-white flex items-center justify-between px-20 py-4 dark:text-white text-black border-b border-b-muted-foreground/40">
      <Link href="/" className="font-bold text-3xl">SEMICOLON</Link>
      <div className="flex gap-2">
        <ModeToggle />
        <NavItem href="/dashboard" linkto="/dashboard">Dashboard</NavItem>
        {session?.user.access !== access.STUDENT && <NavItem href="/aiml-library" linkto="/aiml-library">Aiml Library</NavItem>}
        {session?.user && <LogoutButton />}
        {!session?.user && <Link href="/sign-in" className={cn(buttonVariants({variant: "ghost"}),"font-semibold w-[105px] ml-4")}>Sign In</Link>}
      </div>
    </div>
  )
}

export default Navbar


