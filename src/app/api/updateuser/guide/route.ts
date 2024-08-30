import { getServerSession } from "next-auth";
import prisma from "../../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";


async function updateguide(request:NextRequest){
      const session=await getServerSession()
      const {contactNo, nationality, languages, lat, lng, isActive}=await request.json();

      try {
            
            const user=await prisma.user.findFirst({
                  where:{
                        email:session?.user?.email
                  }
            })
            
            const guide =await prisma.user.update({
                  where:{
                        id:user.id
                  },
                  data:{
                        contactNo,
                        nationality,
                        languages,
                        locations:[lat, lng],
                        isActive:isActive
                  }
            })
            if(guide){
                  return NextResponse.json(
                        { success: true, message: "Guide Updated Successfully" },
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Buyer Update Failed " },
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
export {updateguide as POST}