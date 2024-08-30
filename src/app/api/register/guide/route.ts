import { getServerSession } from "next-auth";
import prisma from "../../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";


async function guideSignup(request:NextRequest){
      const session=await getServerSession()
      const {contactNo, nationality, languages, lat, lng}=await request.json();

      try {
            
            const user=await prisma.user.findFirst({
                  where:{
                        email:session?.user?.email
                  }
            })
            
            if(user.role==="GUIDE" || user.role=="USER"){
                  return NextResponse.json(
                        { success: false, message: "User with this email already Exists" },
                        { status: 200 }
                      );
            }

            const guide =await prisma.user.update({
                  where:{
                        id:user.id
                  },
                  data:{
                        contactNo,
                        nationality,
                        role:"GUIDE",
                        languages,
                        locations:[lat, lng],
                        emailVerified:true
                  }
            })
            if(guide){
                  return NextResponse.json(
                        { success: true, message: "Guide Registered Successfully" },
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Buyer Register Failed " },
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
export {guideSignup as POST}