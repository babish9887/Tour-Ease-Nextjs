import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../lib/mailer";
import prisma from '../../../db/dbconfig'

export async function POST(request: NextRequest){
    try{
        const {email} = await request.json();

      console.log(email)
      const user = await prisma.user.findUnique({
            where: {
                  email
            }
        })
        if(!user){
            return NextResponse.json({error: "User does not Exist"}, {status:404})
        }

        const res=sendEmail({email, emailType: "RESET", userId: user.id})
        console.log(res)
        return NextResponse.json({
            message: "Check your Email",
            success: true
        }, {status: 200})
    }catch(e:any){
        return NextResponse.json({error: e.message, success: false}, {status: 500})
    }
}