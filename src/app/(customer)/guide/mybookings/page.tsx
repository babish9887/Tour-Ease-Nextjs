"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Session } from "../../../../lib/schema";

function MyBookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: session }: { data: Session | null | undefined } = useSession();

  const router = useRouter();
  if (session?.user?.role == "USER") router.replace("/mybookings");

  useEffect(() => {
    async function getMyBookings() {
      await axios.get("/api/getguidebookings").then((res) => {
        if (res.data.success) setBookings(res.data.bookings);
      });
    }
    getMyBookings();
  }, []);

  async function handleCancelBooking(booking: any) {
    setLoading(true);
    //@ts-ignore
    const reason = document.getElementById("reason").value;
    try {
      await axios
        .post("/api/requestcancel", { id: booking.id, reason })
        .then((res) => {
          if (res.data.success) {
            toast.success("Booking Cancel requested Successfully");
          } else {
            toast.error(res.data.message);
          }
        });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  if (bookings === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader size={24} />
      </div>
    );
  }

  if (session?.user === null || session?.user == undefined) {
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-3">
        <h1>Sign In to Get Your Bookings</h1>
        <div className="flex gap-4">
          <Link href="/user/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/newuser">
            <Button
              variant="secondary"
              className="text-black hover:text-black border border-gray-200"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-24 bg-slate-100" />
      {/* <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-[calc(50%)] aspect-[1155/678] w-[48rem] -z-50 -translate-x-1/2 rotate-[80deg] md:rotate-[30deg] bg-gradient-to-tr from-[#59e68f] to-[#30d3bd] opacity-70 sm:opacity-30 sm:left-[calc(20%)] sm:w-[60rem] md:w-[80rem] md:-top-12 lg:w-[120rem] lg:-top-10 "
        /> */}
      <div className="min-h-[calc(100vh-6rem)] h-auto w-full flex flex-col justify-start items-center  bg-slate-100 bg-[url('/bghead2.png')] bg-contain bg-no-repeat bg-center">
        <h1 className="text-2xl lg:text-3xl font-bold mt-4">
          Here are your bookings
        </h1>
        <div className="grid  xl:grid-cols-3 grid-cols-1 lg:grid-cols-2  sm:p-3 max-w-[1600px]  ">
          {bookings &&
            //@ts-ignore
            bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="flex justify-center items-center min-w-[24rem] w-full  sm:w-auto max-w-[27rem] p-4 sm:m-4  my-2 border-2 rounded-lg bg-white border-slate-200 shadow-lg"
              >
                {/* Guide Image */}
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

                  {/* Booking Details */}
                  <div className="flex flex-col mb-4">
                    <p className="text-xs">
                      Booked on: {booking.createdAt.split("T")[0]}
                    </p>
                    <p className="text-xs">
                      From <span>{booking.bookingDate.split("T")[0]}</span> To{" "}
                      <span>{booking.endDate.split("T")[0]}</span>
                    </p>
                    <p className="text-xs">Contact No: {booking.contactNo}</p>

                  </div>

                  {/* Edit Button */}
                </div>
                {booking.isEnded ? (
                  <div>Ended</div>
                ) : (
                  <div className="flex gap-3">
                    <Dialog >
                      <DialogTrigger asChild>
                        <Button
                        //   onClick={() => setOpen(true)}
                          variant={"destructive"}
                          className="text-white py-0"
                          disabled={booking.cancelRequest !== undefined}
                        >
                          {booking.cancelRequest === undefined
                            ? "Request Cancel"
                            : "Cancel Requested"}
                        </Button>
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
                          <Button
                            disabled={loading}
                            type="button"
                            variant={"destructive"}
                            onClick={() => handleCancelBooking(booking)}
                          >
                            Submit
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default MyBookingsPage;
