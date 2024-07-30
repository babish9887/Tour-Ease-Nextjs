import React from 'react'
import TouristForm from '@/components/TouristForm'
import { getServerSession } from 'next-auth'
import prisma from "../../../db/dbconfig";
import AuthContext from '../../../context/AuthContext'
const page = async () => {

      const session=await getServerSession();
      const user=await prisma.user.findFirst({
            where:{
                  email:session?.user?.email
            }
      })
  return (
    <div className='w-full grainy'>
      <AuthContext>

        <TouristForm user={user}/>
      </AuthContext>
    </div>
  )
}

export default page