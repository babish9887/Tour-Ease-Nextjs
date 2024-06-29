"use client"
import { signIn, useSession } from 'next-auth/react'
import React from 'react'

function page() {
      const {data:session}=useSession()
      console.log(session)
  return (
    <div>
      <button onClick={()=>signIn("google")}>Sign In</button>
    </div>
  )
}

export default page