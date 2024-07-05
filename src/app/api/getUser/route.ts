import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function getUser(){
      const session=await getServerSession()
      const user=await prisma.user.findFirst({
            where:{
                  email:session?.user?.email
            }
      })
      if(user){
            return NextResponse.json({success: true, mesage:"Got User", user}, {status:200})
      }
      return NextResponse.json({success: true, mesage:"Failed to Get User"}, {status:200})

}

export {getUser as GET}