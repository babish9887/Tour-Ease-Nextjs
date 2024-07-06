"use client"
import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function page() {
      const {data:session}=useSession()
      console.log(session)
  return (
      <>
    <div className='w-full gap-y-4 p-6 sm:p-0 text-white flex flex-col justify-center items-center h-screen bg-slate-400 bg-[url("/assets/12.jpg")] bg-left-bottom bg-cover'>
            <h1 className='font-bold text-white text-5xl text-center'>Discover, Explore, and Book with Ease!</h1>
            <h3 className='text-2xl text-center'>Explore the World with a Local Guide</h3>
            <Link href={'/getguides'}>
            <Button className='  hover:bg-green-600'>Book Your Guide Now</Button>
            </Link>
    </div>

    {/* <div className='w-full h-screen'>

    </div> */}
      </>
  )
}

export default page