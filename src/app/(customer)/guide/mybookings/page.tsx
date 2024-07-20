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



function MyBookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);

  const {data:session}=useSession()
  const router=useRouter()
  if(session?.user?.role=="USER")
      router.replace('/mybookings')

  useEffect(() => {
    async function getMyBookings() {
      await axios.get("/api/getguidebookings").then((res) => {
        console.log(res.data.bookings);
        if (res.data.success) setBookings(res.data.bookings);
      });
    }
    getMyBookings();
  }, []);


  async function handleCancelBooking(booking:any){
      setLoading(true)
       //@ts-ignore
       const reason=document.getElementById('reason').value
       console.log(reason)
      try {
            await axios.post("/api/requestcancel", {id:booking.id,reason})
            .then((res) => {
                  if(res.data.success){
                        toast.success("Booking Cancel requested Successfully")
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
      return<div className="flex justify-center items-center h-screen flex-col gap-3"><h1>Sign In to Get Your Bookings</h1><Button onClick={()=>signIn("google")}>Sign In</Button></div>
  }
  
  return (
    <>
      <div className="h-24" />

      <div className="min-h-[calc(100vh-6rem)] h-auto w-full">
        <h1 className="text-2xl font-semibold">Here are your bookings</h1>
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
                 
                  <div>Ended</div>

                   :
                        <div className="flex gap-3">
                            <Dialog>
                              <DialogTrigger asChild>
                            <Button variant={"destructive"} className="text-white py-0" disabled={booking.cancelRequest!==undefined}>{booking.cancelRequest===undefined?"Request Cancel":"Cancel Requested"}</Button>
                              
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Request Cancel for Booking</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="username" className="text">
                                      Why are you request Canceling?
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
