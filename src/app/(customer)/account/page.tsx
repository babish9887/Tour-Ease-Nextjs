"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { PulseLoader } from 'react-spinners'

// Dynamically import components to ensure they are only loaded on the client side
const UserSettings = dynamic(() => import('@/components/UserSettings'), { ssr: false })
const GuideSettings = dynamic(() => import('@/components/GuideSettings'), { ssr: false })

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "USER" | "GUIDE";
}

interface Session {
    user?: User;
}

function AccountPage() {
    const { data: session }:{data:Session | null} = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Perform redirection based on session state
        const checkUserSession = async () => {
            if (session?.user === undefined) {
                router.replace('/')
            } else {
                setLoading(false)
            }
        }

        checkUserSession()
    }, [session, router])

    // Conditional rendering based on loading state
    if (loading) {
        return (
            <div className='h-[calc(100vh-6rem)] w-full flex justify-center items-center'>
                <PulseLoader size={24} />
            </div>
        )
    }

    return (
        <>
            <div className='h-24' />
         
            {session?.user?.role === "USER" && <UserSettings />}
            {session?.user?.role === "GUIDE" && <GuideSettings />}
        </>
    )
}

export default AccountPage
