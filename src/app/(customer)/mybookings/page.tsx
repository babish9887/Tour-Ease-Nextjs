"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";


import { Button } from "@/components/ui/button"
import { Textarea} from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import StarRating from '@/components/StarRating'



function MyBookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const[isEditing, setIsEditing]=useState(false);
  const[isReviewing, setIsReviewing]=useState(false);
  const[rating, setRating]=useState(0);

  useEffect(() => {
    async function getMyBookings() {
      await axios.get("/api/getMyBookings").then((res) => {
        console.log(res.data.bookings);
        if (res.data.success) setBookings(res.data.bookings);
      });
    }
    getMyBookings();
  }, []);

  async function handleBookingChange(booking:any){
      setLoading(true)
      //@ts-ignore
      const startDate=document.getElementById('startdate').value
      //@ts-ignore
      const endDate=document.getElementById('enddate').value
      if(new Date(startDate)> new Date(endDate)){
            return toast.error("Starting Date can't be more than Ending Date")
      }
      try {
            
      await axios.post("/api/updateBookings", {date:startDate, endDate, createdAt:booking.createdAt}).then((res) => {
            if(res.data.success){
                  toast.success("Booking Updated Successfully")
            }
            else{
                  toast.error(res.data.message)
            }
      })
      } catch (error:any) {
                  toast.error(error.message)
      } finally {
            setLoading(false)
      }
  }

  async function handleSubmit(booking:any){
      setLoading(true)
       //@ts-ignore
       const review=document.getElementById('review').value
       console.log(review)
      try {
            await axios.post("/api/guidereview", {id:booking.bookedUser, rating, review})
            .then((res) => {
                  console.log(res.data)
            })
      } catch (error:any) {
            toast.error(error.message)
      } finally {
      setLoading(false)
}
  }

  if(bookings===null){
      return <div className="flex justify-center items-center h-screen"><PulseLoader size={24} /></div>
  }
  return (
    <>
      <div className="h-24" />

      <div className="min-h-[calc(100vh-6rem)] h-auto w-full">
        <h1 className="text-2xl font-semibold">Here Are your bookings</h1>
        <div className="flex flex-col gap-y-2 p-3 ">
          {bookings && 
          //@ts-ignore
            bookings.map((booking:any)=>(
                  <div key={booking.id} className="flex justify-center items-center w-[26rem] p-4 border rounded-md bg-slate-100 border-slate-500">
                  {/* Guide Image */}
                  <img
                    src={booking.image}
                    alt={booking.name}
                    className="rounded-full w-16 h-16 mr-4"
                  />
                  
                  {/* Guide Details */}
                  <div className="flex flex-col flex-grow">
                    {/* Guide Name */}
                    <h1 className="font-bold mb-2">{booking.name}</h1>
                    
                    {/* Booking Details */}
                    <div className="flex flex-col mb-4">
                      <p className="text-xs">Booked on: {booking.createdAt.split('T')[0]}</p>
                      <p className="text-xs">From <span>{booking.bookingDate.split('T')[0]}</span> To <span>{booking.endDate.split('T')[0]}</span></p>
                     
              
                    </div>
                    
                    {/* Edit Button */}
                  </div>
                    {booking.isEnded ? 
                     <Dialog>
                     <DialogTrigger asChild>
                       <Button variant="outline">Review  </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                       <DialogHeader>
                         <DialogTitle>Give Your Review</DialogTitle>
                         <DialogDescription>
                              About Guide and Your Experience
                         </DialogDescription>
                       </DialogHeader>
                       <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-2 items-center gap-2">
                           <Label htmlFor="name" className="text-left">
                             How was your experience ? 
                           </Label>
                         <StarRating maxRating={5} color="green" size={24} onSetRating={setRating} />
                         </div>
                         <div className="grid grid-cols-1 items-center gap-4">
                           <Label htmlFor="username" className="text-left">
                             Write Your Review
                           </Label>
                           <Textarea
                             id="review"
                             placeholder="Type your review here. "
                             className="col-span-3"
                           />
                         </div>
                       </div>
                       <DialogFooter>
                         <Button type="button" variant={"default"}  onClick={()=>handleSubmit(booking)}>Submit Review</Button>
                       </DialogFooter>
                     </DialogContent>
                   </Dialog>

                   :


                              <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">Edit</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Your Booking</DialogTitle>
                                  <DialogDescription>
                                    Make changes to your booking Date
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                      Start Date
                                    </Label>
                                    <Input
                                      id="startdate"
                                      type="date"
                                      defaultValue="Pedro Duarte"
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                      End Date
                                    </Label>
                                    <Input
                                      id="enddate"
                                      type="date"
                                      defaultValue="@peduarte"
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="button" onClick={()=>handleBookingChange(booking)}>Submit Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                
                
                
                
                }
                </div>
            ))
           }
        




          
        </div>



      </div>
    </>
  );
}

export default MyBookingsPage;
