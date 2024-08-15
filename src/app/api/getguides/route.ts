import { getServerSession } from "next-auth";
import prisma from "../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
async function getGuides(request:NextRequest){
      const {lat, lng}=await request.json();
      try {

            console.log(lat, lng)
            const minlat=(lat-0.0500).toFixed(4)
            const maxlat=(lat+0.0500).toFixed(4)
            console.log(minlat, maxlat)

            const minlng=(lng-0.0500).toFixed(4)
            const maxlng=(lng+0.0500).toFixed(4)
            console.log(minlng, maxlng)


            const users=await prisma.user.findMany()

            console.log(users)
            const guides=users.filter((user:any)=>
                  (user.locations[0]>minlat && user.locations[0]<maxlat) && (user.locations[1]>minlng && user.locations[1]<maxlng) && (user.isActive===true)
            )
            console.log(guides)

            if(guides){
                  return NextResponse.json(
                        { success: true, message: "Guides Fetched Successfully", guides},
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Guides fetch Failed " },
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

export {getGuides as POST}