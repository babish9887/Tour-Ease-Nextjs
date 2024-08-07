import { getServerSession } from "next-auth";
import prisma from "../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";


async function updataGuide(request:NextRequest){
      const session=await getServerSession()
      const {contactNo, nationality, languages, lat, lng}=await request.json();
      console.log(contactNo, nationality, languages, lat, lng)

      try {
            
            const user=await prisma.user.findFirst({
                  where:{
                        email:session?.user?.email
                  }
            })
            
            // console.log(user)
            // if(user.role==="GUIDE"){
            //       return NextResponse.json(
            //             { success: false, message: "User with this email already Exists" },
            //             { status: 200 }
            //           );
            // }

            console.log(user)
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
            console.log(guide)
            if(guide){
                  return NextResponse.json(
                        { success: true, message: "Guide Updated Successfully" },
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Guide Update Failed " },
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