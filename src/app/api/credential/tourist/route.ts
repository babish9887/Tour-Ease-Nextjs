import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import prisma from '../../../../db/dbconfig'
async function touristSignup(request:NextRequest){
      const {nationality, contactNo, name, email , password}=await request.json()
      console.log(email)
     try {
      const oldUser=await prisma.user.findFirst({
            where:{
                  email
            }
      })

      if(oldUser)
            return NextResponse.json({success:false, message:"User already Exists"}, {status:200})

      const hash=await bcrypt.hash(password, 12);
      const user=await prisma.user.create({
            data:{
                  nationality,
                  contactNo,
                  role:"USER",
                  name,
                  email,
                  password:hash,
            }
      })
      return NextResponse.json({success:true, message:"User Created Successfully", user}, {status:200})
     } catch (error) {
            console.log(error)
            return NextResponse.json({success:false, message:"Something went Wrong"}, {status:500})
     }
}

export {touristSignup as POST}