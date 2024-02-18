"use client"
import React from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'


const LogoutButton = () => {
  return (
  <Button className="font-semibold w-[125px]" onClick={() => signOut()}>Sign Out</Button>)
}

export default LogoutButton
