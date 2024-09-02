import { getServerSession } from "next-auth";
import prisma from "../../../db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
async function getGuides(request:NextRequest){
      const {lat, lng}=await request.json();
      try {

            const minlat=(lat-0.0500).toFixed(4)
            const maxlat=(lat+0.0500).toFixed(4)

            const minlng=(lng-0.0500).toFixed(4)
            const maxlng=(lng+0.0500).toFixed(4)


            const users=await prisma.user.findMany()
            console.log(users)
            const guides=users.filter((user:any)=>
                  (user.locations[0]>minlat && user.locations[0]<maxlat) && (user.locations[1]>minlng && user.locations[1]<maxlng) && user.emailVerified==true && user.role=="GUIDE"
            )

            // if(guides){
            //       const updatedGuidesPromises=guides.map(async (guide:any)=>{
            //             const ratings=await prisma.rating.findMany({
            //                   where:{
            //                         tourId:guide.id
            //                   }
            //             })
            //             const totalRatings = ratings.reduce((sum:Number, obj:any) => sum + obj.rating, 0);
            //             const averageRating=totalRatings/ratings.length

            //             const reviews=await prisma.review.findMany({
            //                   where:{
            //                         tourId:guide.id
            //                   }
            //             })
            //             const updatedReviews=reviews.map(async review=>{
            //                   const rating=ratings.find((rating)=>rating.tourId=review.tourId)
            //                   const user=await prisma.user.findUnique({
            //                         where:{
            //                               id:review.userId
            //                         }
            //                   })
            //                   return{
            //                         ...review,rating,
            //                         name:user.name,
            //                         image:user.image
            //                   }
            //             })
            //             return{
            //                   ...guide,
            //                   rating:averageRating,
            //                   reviews:updatedReviews
                              
            //             }
            //       })
            //       const updatedGuides = await Promise.all(updatedGuidesPromises);
            //       console.log(updatedGuides)
            //       return NextResponse.json(
            //             { success: true, message: "Guides Fetched Successfully", guides:updatedGuides},
            //             { status: 200 }
            //           );
            // }



            if (guides) {
                  const updatedGuidesPromises = guides.map(async (guide: any) => {
                    const ratings = await prisma.rating.findMany({
                      where: {
                        tourId: guide.id
                      }
                    });
                
                    const totalRatings = ratings.reduce((sum: number, obj: any) => sum + obj.rating, 0);
                    const averageRating = ratings.length > 0 ? totalRatings / ratings.length : 0; // Handle division by zero
                
                    const reviews = await prisma.review.findMany({
                      where: {
                        tourId: guide.id
                      }
                    });
                
                    const updatedReviewsPromises = reviews.map(async (review: any) => {
                      const rating = ratings.find((rating: any) => rating.tourId === review.tourId); // Fix assignment to comparison
                
                      const user = await prisma.user.findUnique({
                        where: {
                          id: review.userId
                        }
                      });
                
                      return {
                        ...review,
                        rating:rating.rating,
                        name: user?.name, 
                        image: user?.image
                      };
                    });
                
                    const updatedReviews = await Promise.all(updatedReviewsPromises);
                    
                    const tours = await prisma.booking.findMany({
                        where: {
                          bookedUser: guide.id,
                          endDate: {
                            lt: new Date()
                          }
                        }
                      });
                      
                    return {
                      ...guide,
                      rating: averageRating,
                      reviews: updatedReviews,
                      tours:tours.length
                    };
                  });
                
                  const updatedGuides = await Promise.all(updatedGuidesPromises);
                
                  return NextResponse.json(
                    { success: true, message: "Guides Fetched Successfully", guides: updatedGuides },
                    { status: 200 }
                  );
                }
                
            return NextResponse.json(
                  { success: false, message: "Guides fetch Failed " },
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

export {getGuides as POST}