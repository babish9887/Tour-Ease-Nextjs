import React from 'react'
import GuideForm from '@/components/GuideForm'
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

        <GuideForm user={user}/>
      </AuthContext>
    </div>
  )
}

export default page