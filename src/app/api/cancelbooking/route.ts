import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function cancelBooking(request:NextRequest){
      const {id, reason}=await request.json()
      console.log(id)
      const booking=await prisma.booking.delete({
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
      if(canceledBooking){
            return NextResponse.json({success: true, mesage:"Booking Canceled"}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Booking can't be canceled"}, {status:200})

}

export {cancelBooking as POST}