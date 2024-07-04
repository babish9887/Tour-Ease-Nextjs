"use client"
import UserSettings from '@/components/UserSettings'
import GuideSettings from '@/components/GuideSettings'
import {PulseLoader} from 'react-spinners'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

function AccountPage() {
      const{data:session}=useSession()
      const [loading, setLoading]=useState(true)
      
  return (
<>
<div className='h-24' />
      {!session?.user && <div className='h-[calc(100vh-6rem)] w-full flex justify-center items-center'>
            <PulseLoader size={24} />
            
            </div>}
      {session?.user?.role==="USER" && <UserSettings />}
      {session?.user?.role==="GUIDE" && <GuideSettings />}

  
</>
  )
}

export default AccountPage