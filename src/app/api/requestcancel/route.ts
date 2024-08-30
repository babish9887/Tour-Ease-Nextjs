import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function requestcancel(request:NextRequest){
      const {id, reason}=await request.json()
      const booking=await prisma.booking.findFirst({
            where:{
                  id
            }
      })

      const oldRequest=await prisma.RequestCancel.findFirst({
            where:{
                  bookingId: id
            }
      })

      if(oldRequest){
            return NextResponse.json({success: false, message:"Booking Cancel Request already Created"}, {status:200})

      }

      const requestcancel=await prisma.RequestCancel.create({
            data:{
                  bookingId:booking.id, 
                  reason
            }
      })
      if(requestcancel){
            return NextResponse.json({success: true, message:"Booking Canceled"}, {status:200})
      }
      return NextResponse.json({success: false, message:"Booking can't be canceled"}, {status:200})

}

export {requestcancel as POST}