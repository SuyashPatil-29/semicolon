import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'


const StudentDashboard = async () => {
  const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <div className="text-3xl pt-24 font-semibold">Welcome {session?.user?.name}</div>
  )
}

export default StudentDashboard
