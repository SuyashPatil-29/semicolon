import Classroom from '@/components/Classroom'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    classroomId: string
  }
}

const page = async ({params:{classroomId}}: Props) => {
  const session = await getServerSession(authOptions)
  if(!session?.user){
    redirect("/sign-in")
  }

  return (
    <div className='dark:text-white pt-24'>
      <Classroom classroomId={classroomId} user={session?.user} />
    </div>
  )
}

export default page
