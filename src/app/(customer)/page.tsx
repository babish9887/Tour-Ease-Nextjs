"use client"
import { signIn, useSession } from 'next-auth/react'
import React from 'react'

function page() {
      const {data:session}=useSession()
      console.log(session)
  return (
    <div>
      <h1>Home Page gonna be Here</h1>
    </div>
  )
}

export default page