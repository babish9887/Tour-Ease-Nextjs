import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function cancelBooking(request:NextRequest){
      const {id, reason}=await request.json()
      console.log(id)
      const booking=await prisma.booking.findFirst({
            where:{
                  id
            }
      })

      const canceledBooking=await prisma.canceledBooking.create({
            data:{
                 ...booking,
                  reason
            }
      })
      const deletedBooking=await prisma.booking.delete({
            where:{
                  id:booking.id
            }
      })
      if(canceledBooking && deletedBooking){
            
            return NextResponse.json({success: true, message:"Booking Canceled"}, {status:200})
      }
      return NextResponse.json({success: false, message:"Booking can't be canceled"}, {status:200})

}

export {cancelBooking as POST}