import AuthNavbar from '@/components/AuthNavbar'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const layout = async ({children}: Props) => {
  const session = await getServerSession(authOptions)

  if(session?.user){
    redirect("/dashboard")
  }

  return (
    <div className='dark:bg-[rgb(28,28,28)] min-h-screen min-w-[100vw]'>
      <AuthNavbar />
      {children}
    </div>
  )
}

export default layout
