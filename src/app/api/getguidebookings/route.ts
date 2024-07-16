import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function getguidebookings(){
      const session=await getServerSession()
      const user=await prisma.user.findFirst({
            where:{
                  email:session?.user?.email
            }
      })
      const bookings=await prisma.booking.findMany({
            where:{
                  bookedUser:user.id
            }
      })
      console.log(bookings)
      const usersId=bookings.map((booking:any)=>booking.bookedBy)
      const users=await prisma.user.findMany({
            where: {
                  id:{
                        in: usersId
                  }
            }
      })

      // const bookingwithdetails=guides.map((guide)=>{
      //       const booking=bookings.find(booking=>booking.booked=guide.id)
      //       const isEnded=booking.endDate<new Date(Date.now())
      //       return{
      //             ...guide,
      //             ...booking,
      //             isEnded
      //       }
      // })

      const bookingwithdetails = users.map((guide:any) => {
            const guideBookings = bookings.filter((booking:any) => booking.bookedBy === guide.id);
            const details = guideBookings.map((booking:any) => ({
                  ...guide,
                  ...booking,
                  isEnded: booking.endDate < new Date(Date.now())
            }));
            return details;
      }).flat();
      
      console.log(bookingwithdetails)

      if(bookings){
            return NextResponse.json({success: true, mesage:"Got bookings", bookings:bookingwithdetails}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Failed to Get bookings"}, {status:200})

}

export {getguidebookings as GET}