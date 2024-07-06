import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../db/dbconfig'
async function guideReview(request:NextRequest){
      const session=await getServerSession()
      const {id, rating, review}=await request.json()
      const user=await prisma.user.findFirst({
            where:{
                  email:session?.user?.email
            }
      })
      const oldreviews=await prisma.review.findMany({
            where:{
                  AND:[
                        {userId:user.id},
                        {tourId:id}
                  ]
            }
      })
      const oldRatings=await prisma.rating.findMany({
            where:{
                  AND:[
                        {userId:user.id},
                        {tourId:id}
                  ]
            }
      })
      if(oldreviews.length>0 || oldRatings.length>0){
            return NextResponse.json({success: false, mesage:"You Have already Reviewed this Guide"}, {status:200})

      }
      const ratingt=await prisma.rating.create({
            data:{
                  userId:user.id,
                  tourId:id,
                  rating
            }
      })
      const reviewt=await prisma.review.create({
            data:{
                  userId:user.id,
                  tourId:id,
                  review
            }
      })
      console.log(ratingt, reviewt)
      if(ratingt && reviewt){
            return NextResponse.json({success: true, mesage:"Reviewed"}, {status:200})
      }
      return NextResponse.json({success: false, mesage:"Failed to Get User"}, {status:200})

}

export {guideReview as POST}