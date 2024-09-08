import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function getMyBookings(req:NextRequest){
      const session=await getServerSession()
      const user=await prisma.user.findFirst({
            where:{
                  email:session?.user?.email
            }
      })

      const params=req.nextUrl.searchParams
      const category=params.get('category')
      console.log(category)
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

      let bookingwithdetails = guides.map((guide:any) => {
            const guideBookings = bookings.filter((booking:any )=> booking.bookedUser === guide.id);
            const details = guideBookings.map((booking:any )=> ({
                  ...guide,
                  ...booking,
                  isEnded: booking.endDate < new Date(Date.now())
            }));
            return details;
      }).flat();
      
      const bookingsId=bookingwithdetails.map((booking:any)=>booking.id)
      const cancelRequests=await prisma.RequestCancel.findMany({
            where:{
                  bookingId:{
                        in: bookingsId
                  }
            }
      })

      if(category==='Completed Bookings'){
            bookingwithdetails=bookingwithdetails.filter(book=>book.isEnded==true)
      } else   if(category==='Upcomming Bookings'){
            bookingwithdetails=bookingwithdetails.filter(book=>book.isEnded==false)
      }
      console.log(bookingwithdetails)
      if(bookings){
            return NextResponse.json({success: true, mesage:"Got bookings", bookings:bookingwithdetails, cancelRequests}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Failed to Get bookings"}, {status:200})
}

export {getMyBookings as GET}