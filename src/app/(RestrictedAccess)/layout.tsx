import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Navbar from '@/components/Navbar'
import { authOptions } from '@/lib/auth'
import { access } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const layout = async ({children}: Props) => {
  const session = await getServerSession(authOptions)

  if(!session?.user){
    redirect("/sign-in")
  }

  if(session.user.access === access.STUDENT){
    redirect("/dashboard")
  }

  return (
    <div className='dark:bg-[rgb(28,28,28)] min-h-screen'>
      <Navbar />
      <MaxWidthWrapper className=''>
      {children}
      </MaxWidthWrapper>
    </div>
  )
}

export default layout


