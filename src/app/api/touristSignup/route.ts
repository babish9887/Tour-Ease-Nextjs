import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function touristSignup(request:NextRequest){
      const session=await getServerSession()
      console.log(session)
      const {nationality, contactNo}=await request.json()
      const user=await prisma.user.update({
            where:{
                  email:"babish9887@gmail.com"
            }, data:{
                  nationality,
                  contactNo,
                  role:"USER"
            }
      })
      return NextResponse.json({mesage:"User Updated Successfully", user}, {status:200})
}

export {touristSignup as POST}