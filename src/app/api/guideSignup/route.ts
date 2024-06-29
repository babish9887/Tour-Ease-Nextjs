import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function guideSignup(request:NextRequest){
      const session=await getServerSession()

      const {locations, languages, contactNo}=await request.json()
      console.log(typeof locations)
      console.log(locations)
      const user=await prisma.user.update({
            where:{
                  email:"babish9887@gmail.com"
            }, data:{
                  contactNo:"2222"
            }
      })

      return NextResponse.json({mesage:"Updated", user}, {status:200})

}

export {guideSignup as POST}