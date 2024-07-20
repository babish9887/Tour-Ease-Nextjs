import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function getMyBookings(){
      const session=await getServerSession()
      const user=await prisma.user.findFirst({
            where:{
                  email:session?.user?.email
            }
      })
      console.log(user)
      const bookings=await prisma.booking.findMany({
            where:{
                  bookedBy:user.id
            }
      })
      const guidesId=bookings.map((booking:any)=>booking.bookedUser)
      const guides=await prisma.user.findMany({
            where: {
                  id:{
                        in: guidesId
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

      const bookingwithdetails = guides.map((guide:any) => {
            const guideBookings = bookings.filter((booking:any )=> booking.bookedUser === guide.id);
            const details = guideBookings.map((booking:any )=> ({
                  ...guide,
                  ...booking,
                  isEnded: booking.endDate < new Date(Date.now())
            }));
            return details;
      }).flat();
      
      console.log(bookingwithdetails)
      const bookingsId=bookingwithdetails.map((booking:any)=>booking.id)
      const cancelRequests=await prisma.RequestCancel.findMany({
            where:{
                  bookingId:{
                        in: bookingsId
                  }
            }
      })
      console.log(cancelRequests)

      if(bookings){
            return NextResponse.json({success: true, mesage:"Got bookings", bookings:bookingwithdetails, cancelRequests}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Failed to Get bookings"}, {status:200})

}

export {getMyBookings as GET}