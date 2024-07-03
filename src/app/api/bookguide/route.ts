import { getServerSession } from "next-auth";
import prisma from "../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { BookUser } from "lucide-react";


async function touristSignup(request:NextRequest){
      const session=await getServerSession()
      const {guideId, date, duration, endDate}=await request.json()
      try {
            console.log(guideId, date, duration)

            console.log(typeof date)
            const user=await prisma.user.findFirst({
                  where:{
                        email:session?.user?.email
                  }
            })
         
            const guide=await prisma.user.findFirst({
                  where:{
                        id:guideId
                  }
            })
            console.log(user, guide)

            // const oldBookings=await prisma.booking.findFirst({
            //       where:{
            //             AND:[
            //                   {bookedUser: guideId},
            //                   {bookingDate:date}
            //             ]
            //       }
            // })

            const oldBookings = await prisma.booking.findMany({
                  where: {
                      bookingDate: {
                          gte: new Date(date+"T00:00:00"),
                          lte: new Date(endDate+"T00:00:00"),
                      }
                  }
              });
            
            if(oldBookings){
                  return NextResponse.json(
                        { success: false, message: "Guide is Already booked" },
                        { status: 200 }
                      );
            }

            const booking=await prisma.booking.create({
                  data:{
                        bookedUser:guideId,
                        bookedBy: user.id,
                        bookingDate:new Date(date+"T00:00:00"),
                        endDate: new Date(endDate+"T00:00:00"),
                        duration:Number(duration)
                  }
            })

            console.log(booking)
            const Tourist =await prisma.user.update({
                  where:{
                        id:guideId
                  },
                  data:{
                       status:"BOOKED"
                  }
            })
            console.log(Tourist)
            if(booking){
                  return NextResponse.json(
                        { success: true, message: "Guide Booked Successfully" },
                        { status: 200 }
                      );
            }
            return NextResponse.json(
                  { success: false, message: "Booking  Failed " },
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
export {touristSignup as POST}