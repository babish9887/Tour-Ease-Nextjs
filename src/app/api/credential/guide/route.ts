import { getServerSession } from "next-auth";
import prisma from "../../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/mailer"

import bcrypt from 'bcrypt'
async function updataGuide(request:NextRequest){
      const {contactNo, nationality, languages, lat, lng, name, email, password, fee}=await request.json();

      try {
            
            const oldUser=await prisma.user.findFirst({
                  where:{
                        email
                  }
            })
        
           if(oldUser)
                  return NextResponse.json({success:false, message:"User already Exists"}, {status:200})
      
            const hash=await bcrypt.hash(password, 12);
            const guide =await prisma.user.create({
                  data:{
                        contactNo,
                        nationality,
                        role:"GUIDE",
                        languages,
                        locations:[lat, lng],
                        emailVerified:false,
                        name,
                        email, 
                        password:hash,
                        fee
                  }
            })
            if(guide){
                  const res=sendEmail({email, emailType: "VERIFY", userId: guide.id})
                  return NextResponse.json(
                        { success: true, message: "Guide Created Successfully" },
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Guide Create Failed " },
                  { status: 400 }
                );

      } catch (error:any) {
            console.log(error)
            return NextResponse.json(
                  { success: false, message: error.message },
                  { status: 500 }
                );
      }
}
export {updataGuide as POST}