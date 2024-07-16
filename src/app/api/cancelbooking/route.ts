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
      const oldRequest=await prisma.RequestCancel.findFirst({
            where:{
                  bookingId:booking.id
            }
      })
      if(oldRequest){
            return NextResponse.json({success: false, mesage:"Booking Cancel already Requested"}, {status:200})
      }
      const canceledBooking=await prisma.RequestCancel.create({
            data:{
                  ...booking, 
                  reason
            }
      })
      if(canceledBooking){
            return NextResponse.json({success: true, mesage:"Booking Canceled"}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Booking can't be canceled"}, {status:200})

}

export {cancelBooking as POST}