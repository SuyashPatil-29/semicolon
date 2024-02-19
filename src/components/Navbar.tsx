import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { ModeToggle } from './ThemeToggleButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import LogoutButton from './LogoutButton'
import { access } from '@prisma/client'


const Navbar = async () => {
const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <div className="w-full fixed z-1000 top-0 left-0 dark:bg-[rgb(35,35,35)] bg-white/10 flex items-center justify-between px-20 py-4 dark:text-white text-black border-b border-b-muted-foreground/40">
      <Link href="/" className="font-bold text-2xl">SEMICOLON</Link>
      <div className="flex gap-8">
        <ModeToggle />
        {session?.user.access !== access.STUDENT && <Link href="/aiml-library" className={cn(buttonVariants({variant: "link"}),"font-semibold w-[125px]")}>Aiml Library</Link>}
        {session?.user && <LogoutButton />}
        {!session?.user && <Link href="/sign-in" className={cn(buttonVariants({variant: "default"}),"font-semibold w-[125px]")}>Sign In</Link>}
      </div>
    </div>
  )
}

export default Navbar


