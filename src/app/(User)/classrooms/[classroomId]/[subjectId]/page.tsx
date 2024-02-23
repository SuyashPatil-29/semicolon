import SubjectDocumentTable from '@/components/SubjectDocumentTable'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    classroomId: string
    subjectId: string
  }
}

const page = async ({ params:{ classroomId, subjectId} }: Props) => {

  const session = await getServerSession(authOptions)

  if(!session?.user){
    redirect("/sign-in")
  }

  return (
    <div className='dark:bg-[rgb(28,28,28)] min-h-screen h-full pt-24'>
      <SubjectDocumentTable classroomId={classroomId} subjectId={subjectId} userName={session?.user?.name} userAccess={session?.user?.access} userId={session?.user?.id}/>
    </div>
  )
}

export default page
