const { NextURL } = require("next/dist/server/web/next-url")
import { getServerSession } from "next-auth";
import prisma from "../../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";


async function updatetourist(request:NextRequest){
      const session=await getServerSession()
      const {contactNo, nationality}=await request.json()
      console.log(contactNo, nationality)
      try {
            
            const user=await prisma.user.findFirst({
                  where:{
                        email:session?.user?.email
                  }
            })
         
            console.log(user)
            const Tourist =await prisma.user.update({
                  where:{
                        id:user.id
                  },
                  data:{
                        contactNo,
                        nationality,
                  }
            })
            console.log(Tourist)
            if(Tourist){
                  return NextResponse.json(
                        { success: true, message: "Buyer Updated Successfully" },
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Buyer Update failed " },
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
export {updatetourist as POST}