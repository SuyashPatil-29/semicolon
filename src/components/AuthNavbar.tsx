"use client"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { ModeToggle } from './ThemeToggleButton'
import { usePathname } from 'next/navigation'

const AuthNavbar = ({user}:{user: any}) => {
  const pathname = usePathname(); 
  return (
    <div className="w-full fixed z-1000 top-0 left-0 dark:bg-[rgb(10,10,10)] bg-white/10 flex items-center justify-between md:px-20 px-4 py-4 dark:text-white text-black border-b border-b-muted-foreground/40">
      <Link href="/" className="font-bold text-2xl">SEMICOLON</Link>
      <div className="flex gap-8">
        <ModeToggle />
        {pathname === "/sign-in" && !user && <Link href="/sign-up" className={cn(buttonVariants({variant: "default"}),"font-semibold md:w-[125px]")}>Sign Up</Link>}
        {pathname === "/sign-up" && !user && <Link href="/sign-in" className={cn(buttonVariants({variant: "default"}),"font-semibold md:w-[125px]")}>Login</Link>}
        {user && <Link href="/dashboard" className={cn(buttonVariants({variant: "default"}),"font-semibold w-[125px]")}>Dashboard</Link>}
      </div>
    </div>
  )
}

export default AuthNavbar

