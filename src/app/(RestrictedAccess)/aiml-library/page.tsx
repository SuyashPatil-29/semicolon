import FileUploadDialog from '@/components/FileUploadDialog'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const session = await getServerSession(authOptions)
  if(!session?.user){
    redirect("/sign-in")
  }

  return (
    <div className = "h-screen pt-20">
      <div className="flex items-center justify-between">
      <h1>AIML Library</h1>
      <FileUploadDialog user={session?.user}/>
      </div>
    </div>
  )
}

export default page
