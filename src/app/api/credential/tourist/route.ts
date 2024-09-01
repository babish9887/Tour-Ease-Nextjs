import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import prisma from '../../../../db/dbconfig'
import { sendEmail } from "../../../../lib/mailer"

async function touristSignup(request:NextRequest){
      const {nationality, contactNo, name, email , password}=await request.json()
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
                  emailVerified:false,
                  name,
                  email,
                  password:hash,
            }
      })
      const res=await sendEmail({email, emailType: "VERIFY", userId: user.id})
      if(res){
            return NextResponse.json({success:true, message:"User created successfully"}, {status:200})
      }
      return NextResponse.json({success:false, message:"Something went wrong", res}, {status:400})
     } catch (error) {
            console.log(error)
            return NextResponse.json({success:false, message:"Something went Wrong"}, {status:500})
     }
}

export {touristSignup as POST}