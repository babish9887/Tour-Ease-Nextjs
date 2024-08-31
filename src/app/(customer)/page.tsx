"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
      <div className=' h-screen overflow-hidden relative '>

            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="absolute left-[calc(50%)] aspect-[1155/678] w-[48rem] -translate-x-1/2 rotate-[80deg] md:rotate-[30deg] bg-gradient-to-tr from-[#59e68f] to-[#30d3d3] opacity-70 sm:opacity-30 sm:left-[calc(20%)] sm:w-[60rem] md:w-[80rem] md:-top-12 lg:w-[120rem] lg:-top-10 "
            />
<div className='h-screen w-full flex flex-col md:flex-row backdrop-blur-3xl overflow-hidden'>
  <div className='w-full md:w-1/2 flex flex-col h-screen '>


  <div className='w-full md:w-1/2 h-1/2 justify-center items-center p-16 pt-36 md:hidden  relative'>
  {/* <img src='/triangle.png' className='z-0 w-full rotate-[90deg]' /> */}
  <img src='/home.png' className='relative z-10 w-full self-center sm:px-16' />
</div>

    <div className='w-full gap-y-4 p-6 md:p-4 text-black flex flex-col justify-center items-center h-screen '>
      <h1 className='font-bold text-green-600 text-5xl text-center'>Discover, Explore, and Book with Ease!</h1>
      <h3 className='text-2xl text-center'>Explore the World with a Local Guide</h3>
      <Link href={'/getguides'}>
        <Button className='hover:bg-green-600'>Book Your Guide Now</Button>
      </Link>
    </div>
  </div>
  <div className='w-full md:w-1/2  justify-center items-center p-16 pt-36 hidden md:flex relative'>
  <img src='/triangle.png' className='absolute z-0 w-full rotate-[90deg]' />
  <img src='/home.png' className='z-10' />
</div>

</div>

      </div>
  )
}

export default page