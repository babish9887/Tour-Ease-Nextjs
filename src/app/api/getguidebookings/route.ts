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
      const bookingwithdetails = users.map((guide:any) => {
            const guideBookings = bookings.filter((booking:any) => booking.bookedBy === guide.id);
            const details = guideBookings.map((booking:any) => ({
                  ...guide,
                  ...booking,
                  isEnded: booking.endDate < new Date(Date.now())
            }));
            return details;
      }).flat();

      const bookingIds=bookingwithdetails.map((booking:any)=>booking.id)

      const cancelRequests = await prisma.RequestCancel.findMany({
            where: {
              bookingId: {
                in: bookingIds
              }
            }
          });

      const finalbookingwithdetails=bookingwithdetails.map((booking:any)=>{
            const cancelRequest=cancelRequests.find((cancelRequest:any)=>cancelRequest.bookingId===booking.id)
            return{...booking, cancelRequest}
      })

      if(bookings){
            return NextResponse.json({success: true, mesage:"Got bookings", bookings:finalbookingwithdetails}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Failed to Get bookings"}, {status:200})

}

export {getguidebookings as GET}