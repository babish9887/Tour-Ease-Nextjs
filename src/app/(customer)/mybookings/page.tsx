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
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {Session, CancelRequest} from '../.../../../../lib/schema'
import Link from "next/link";



function MyBookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [cancelRequests, setCancelRequests]= useState<CancelRequest[]>([]);
  const {data:session}:{data:Session | null | undefined}=useSession()

  const router=useRouter()
  if(session?.user?.role=="GUIDE")
      router.replace('/guide/mybookings')

  const [loading, setLoading] = useState(false);
  const[rating, setRating]=useState(0);

  useEffect(() => {
    async function getMyBookings() {
      if(session?.user===null){
            return
      }
      await axios.get("/api/getMyBookings").then((res) => {
            setBookings(res.data.bookings)
            setCancelRequests(res.data.cancelRequests)
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
        //@ts-ignore
        const review=document.getElementById('review').value
      if(review==="") return toast.error("Review cannot be empty")
      setLoading(true)
      try {
            await axios.post("/api/guidereview", {id:booking.bookedUser, rating, review})
            .then((res) => {
                  if(res.data.success){
                        toast.success("Review Submitted Successfully")
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

  async function handleCancelBooking(booking:any){
      setLoading(true)
       //@ts-ignore
       const reason=document.getElementById('reason').value
      try {
            await axios.post("/api/cancelbooking", {id:booking.id,reason})
            .then((res) => {
                  if(res.data.success){
                        toast.success("Booking Canceled Successfully")
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

  if(bookings===null){
      return <div className="flex justify-center items-center h-screen"><PulseLoader size={24} /></div>
  }

  if(session?.user===null || session?.user==undefined){
      return<div className="flex justify-center items-center h-screen flex-col gap-3"><h1>Sign In to Get Your Bookings</h1>
       <div className="flex gap-4">
            <Link href='/user/login'>
                  <Button>Sign In</Button>
            </Link>
            <Link href='/newuser'>
                  <Button variant="secondary" className="text-black hover:text-black border border-gray-200">Sign Up</Button>
            </Link>
      </div></div>
  }
  
  return (
    <>
      <div className="h-24 bg-slate-50"/>

      <div className="min-h-[calc(100vh-6rem)] h-auto w-full flex flex-col justify-start items-center  bg-slate-50 bg-[url('/bghead2.png')] bg-contain bg-no-repeat bg-center ">
        <h1 className="text-2xl lg:text-3xl font-bold mt-4">Here Are your bookings</h1>
        <div className=" grid xl:grid-cols-3 grid-cols-1 lg:grid-cols-2 sm:p-3 max-w-[1600px]">
          {bookings && 
          //@ts-ignore
            bookings.map((booking:any)=>(
                  <div key={booking.id} className="flex justify-center items-center min-w-[24rem] w-full  sm:w-auto max-w-[27rem] p-4 sm:m-4  my-2 border-2 rounded-lg bg-white border-slate-200 shadow-lg">
                 {booking.image? <img
                    src={booking.image}
                    alt={booking.name}
                    className="rounded-full w-16 h-16 mr-4"
                  />
                  :
                  <div className="w-12 mr-4 text-white text-center text-xl font-bold flex justify-center items-center rounded-full aspect-square bg-green-500">
                        {booking.name.charAt(0)}{booking.name.split("")[1] && booking.name.split(" ")[1].charAt(0)}
                  </div>
                  }
                  
                  {/* Guide Details */}
                  <div className="flex flex-col flex-grow">
                    {/* Guide Name */}
                    <h1 className="font-bold mb-2">{booking.name}</h1>
                    
                    <div className="flex flex-col mb-4">
                      <p className="text-xs">Booked on: {booking.createdAt.split('T')[0]}</p>
                      <p className="text-xs">From <span>{booking.bookingDate.split('T')[0]}</span> To <span>{booking.endDate.split('T')[0]}</span></p>
                      <p className="text-xs">Contact No: {booking.contactNo}</p>

                     
                     {cancelRequests.length>0 &&cancelRequests.some((cancelRequest:CancelRequest) => cancelRequest.bookingId === booking.id) && 
                     <div>
                        <p className="text-sm">Guide Requested for Cancel</p>
                        <p className="text-xs">Reason: { cancelRequests.filter((cancelRequest:CancelRequest) => cancelRequest.bookingId === booking.id)[0].reason} (Delete to Cancel)</p>
                     </div>
                     }
              
                    </div>
                    
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
                             How was your experience? 
                           </Label>
                         <StarRating messages={[]} className="" maxRating={5} color="green" size={24} onSetRating={setRating} defaultRating={2} />
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
                         <Button  disabled={loading} type="button" variant={"default"}  onClick={()=>handleSubmit(booking)} >Submit Review</Button>
                       </DialogFooter>
                     </DialogContent>
                   </Dialog>

                   :
                        <div className="flex gap-3">

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
                                  <Button  disabled={loading} type="button" onClick={()=>handleBookingChange(booking)}>Submit Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                
                            <Dialog>
                              <DialogTrigger asChild>
                            <Button variant={"destructive"} className="text-white py-0"><Trash2Icon /></Button>
                              
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Are Your Sure to Cancel Booking?</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="username" className="text">
                                      Why are you cancelling the booking?
                                    </Label>
                                    <Textarea
                                      id="reason"
                                      placeholder="Write reason to cancel"
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button disabled={loading} type="button" variant={"destructive"} onClick={()=>handleCancelBooking(booking)}>Submit</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            </div>
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
