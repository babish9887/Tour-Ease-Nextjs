import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import prisma from '../../../db/dbconfig'

export async function POST(request: NextRequest){
    try{
        const { token, password} = await request.json();
      const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.updateMany({
            where:{
                  AND:[
                        {forgotPasswordToken: token},
                        {forgotPasswordTokenExpiry:{
                              gt:new Date()
                        }}
                  ]
            },
            data: {
                  password: hashedPassword,
                  forgotPasswordToken: "",
                  forgotPasswordTokenExpiry: null
            }
        })
        if(!user){
            return NextResponse.json({error: "User does not Exist", success: false}, {status:404})
        }
        console.log(user)
        const response = NextResponse.json({
            message: "Check your Email",
            success: true
        }, {status: 200})
        return response
    }catch(e:any){
            console.log(e.message)
        return NextResponse.json({error: e.message}, {status: 500})
    }
}