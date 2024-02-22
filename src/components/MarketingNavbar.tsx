import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { ModeToggle } from './ThemeToggleButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const MarketingNavbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className="w-full fixed z-1000 top-0 left-0 dark:bg-black/30 bg-white/10 flex items-center justify-between md:px-20 px-2 py-4 dark:text-white text-black border-b border-b-muted-foreground">
      <Link href="/" className="font-bold text-2xl">SEMICOLON</Link>
      <div className="flex md:gap-8 gap-2">
        <ModeToggle />
        {session?.user ? <Link href="/dashboard" className={cn(buttonVariants({variant: "default"}),"font-semibold w-[125px]")}>Dashboard</Link> : <Link href="/sign-in" className={cn(buttonVariants({variant: "default"}),"font-semibold w-[125px]")}>Login</Link> }
      </div>
    </div>
  )
}

export default MarketingNavbar
