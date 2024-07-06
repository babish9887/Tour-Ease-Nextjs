import { getServerSession } from "next-auth";
import prisma from "../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { BookUser } from "lucide-react";


async function updateBookings(request:NextRequest){
      const session=await getServerSession()
      const {createdAt, date,  endDate}=await request.json()
      console.log(date, endDate)

      try {
           
            const user=await prisma.user.findFirst({
                  where:{
                        email:session?.user?.email
                  }
            })
         
           

            const oldBookingstemp = await prisma.booking.findMany({
                  where: {
                      OR: [
                          {
                              bookingDate: {
                                  gte: new Date(date),
                                  lte: new Date(endDate),
                              }
                          },
                          {
                              endDate: {
                                  gte: new Date(date),
                                  lte: new Date(endDate),
                              }
                          }
                      ]
                  }
              });

              const oldBookings=oldBookingstemp.filter((booking)=>booking.createdAt==createdAt)

              
            
            if(oldBookings.length>0){
                  return NextResponse.json(
                        { success: false, message: "Guide is Already booked at these Date" },
                        { status: 200 }
                      );
            }
            const bookingte=await prisma.booking.findFirst({
                  where:{
                        createdAt
                  }
            })
            console.log(bookingte)

            const booking=await prisma.booking.update({
                  where:{
                        id:bookingte.id
                  },
                  data:{
                        bookingDate:new Date(date),
                        endDate: new Date(endDate),
                  }
            })

            console.log(booking)
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
export {updateBookings as POST}