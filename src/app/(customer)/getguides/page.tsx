"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "../.../../../../lib/schema";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Globe, HandCoins, Languages, Star } from "lucide-react";
const Map = dynamic(
  () => import("../../../components/Map").then((mod) => mod.Map),
  {
    ssr: false,
  }
);

function GetGuidesPage() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [guides, setGuides] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [book, setBook] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session }: { data: Session | null | undefined } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role === "GUIDE") {
      router.replace("/");
    }
  }, [session, router]);

  const [guide, setGuide] = useState({
    name: "",
    image: "",
    languages: [],
    nationality: "",
    id: "",
    rating: 0,
    description: "",
    reviews: [],
    tours:null,
    fee:undefined
  });
  async function handleSubmit() {
      const getGuidesToast=toast.loading("Getting Guides...")
    setLoading(true);
    setGuides([]);
    try {
      const res = await axios.post("/api/getguides", {
        lat: position.lat,
        lng: position.lng,
      });
      if (res.data.success) {
        if (res.data.guides.length === 0) {
          setShowGuide(false);
          return toast.error("No guides found in this area.", {id:getGuidesToast});
        }
        setGuides(res.data.guides);
        return toast.success("Got the Guides!", {id:getGuidesToast})
      }
    } catch (error: any) {
      console.error("Error fetching guides:", error.message);
      toast.error("Error fetching guides.",{id:getGuidesToast});
    } finally {
      setLoading(false);
    }
  }

  async function handleBookingSubmit() {
    const date = (document.getElementById("date") as HTMLInputElement).value;
    const endDate = (document.getElementById("date2") as HTMLInputElement)
      .value;

      console.log(date)

    const date1: string = date;
    const date2: string = endDate;

      const todaysDate=new Date(Date.now())
      const year = todaysDate.getFullYear();
      const month = String(todaysDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
      const day = String(todaysDate.getDate()).padStart(2, '0'); // Pad single-digit days with a leading zero

      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate)



    const startDate: Date = new Date(date1);
    const endsDate: Date = new Date(date2);
    const currentDate:Date=new Date(formattedDate)
    const differenceInMilliseconds: number = endsDate.getTime() - startDate.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    console.log(differenceInDays)

    const m: number = startDate.getTime() - currentDate.getTime();
    const d = Math.floor(m / (1000 * 60 * 60 * 24));
      if(d>14)
            return toast.error("You can't book a guide more than 14 days in advance. Please choose a date within the next 14 days.");

    if (differenceInDays>3) {
      return toast.error("You can't book guide for  more than 3 days!");
    }

    if (new Date(date) > new Date(endDate)) {
      return toast.error("Starting Date can't be more than Ending Date");
    }

    if(new Date(date))
    setLoading(true);
    try {
      const res = await axios.post("/api/bookguide", {
        guideId: guide.id,
        date,
        endDate,
      });
      if (res.data.success) {
        toast.success("User is Booked");
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.error("Error Booking guide:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="h-24" />
      <div className="w-full bg-[url('/bghead2.png')] bg-contain bg-no-repeat bg-center overflow-hidden min-h-[calc(100vh-6rem)] flex justify-center items-center ">
        {/* <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-[calc(50%)] aspect-[1155/678] w-[48rem] -z-50 -translate-x-1/2 rotate-[80deg] md:rotate-[30deg] bg-gradient-to-tr from-[#59e68f] to-[#30d3bd] opacity-70 sm:opacity-30 sm:left-[calc(20%)] sm:w-[60rem] md:w-[80rem] md:-top-12 lg:w-[120rem] lg:-top-10 "
        /> */}

        <div className="flex justify-center items-center max-w-[1400px] w-full flex-col md:flex-row flex-wrap  relative overflow-hidden ">
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="font-semibold text-3xl sm:mt-3">Get Guides</h1>
            <h2 className="my-2 md:my-4 px-2">
              Pin on the Map where you want to visit! Then we will find nearby
              guides for you.
            </h2>
          </div>
          <div className=" min-h-[calc(100vh-12rem)] w-full flex flex-col gap-y-4 md:flex-row justify-center items-start relative">
            <div className="w-full md:w-1/2 h-full p-4 backdrop-blur-3xl bg-white/60 shadow-lg rounded-2xl min-h-[25rem] sm:min-h[20rem] lg:min-h-[30rem] xl:min-h-[38rem] md:min-h-[30rem]">
              <Map
                setGuide={setGuide}
                setPosition={setPosition}
                showGuide={showGuide}
                setShowGuide={setShowGuide}
                position={position}
                handleSubmit={handleSubmit}
                guides={guides}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
            <div className="w-full md:w-1/2 h-full px-4 rounded-2xl overflow-hidden">
              {guide && showGuide && (
                <div className="flex flex-col backdrop-blur-2xl grainy/90 bg-white/70 shadow-lg rounded-2xl py-8">
                  <div className="flex  min-h-[320px] justify-center lg:justify-start items-center  lg:items-start flex-col lg:flex-row h-auto">
                    <div className="flex justify-start items-start gap-y-1 gap-x-2 mx-8">
                    {guide.image ?  <img
                        src={guide?.image}
                        alt={guide.name}
                        className="rounded-full w-28 aspect-square border-4 border-white"
                      />
                  :
                  <div className="w-12 mr-4 text-white text-center text-xl font-bold flex justify-center items-center rounded-full aspect-square bg-green-500">
                        {guide.name.charAt(0)}{guide.name.split("")[1] && guide.name.split(" ")[1].charAt(0)}
                  </div>
                  }
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-4 text-gray-600">
                        <div className="my-6">
                          <h1 className="text-3xl font-bold text-gray-800">
                            {guide.name}
                          </h1>
                          <p>Total Tours: {guide.tours==0 ? "No Tours yet" : guide.tours}</p>
                        </div>
                        {/* <h2>Languages: {guide.languages.join(", ")}</h2> */}
                        <div className="flex">
                          <HandCoins className="w-5 mx-1" />
                          <h2>Fee per Hour: {guide.fee ? `NPR ${guide.fee}` : "Not available"}</h2>
                        </div>
                        <div className="flex">
                          <Languages className="w-5 mx-1" />
                          <h2>Languages: {guide.languages.join(", ")}</h2>
                        </div>
                        <div className="flex">
                          <Globe className="w-5 mx-1" />
                          <h2>Nationality: {guide.nationality}</h2>
                        </div>
                        <div className="flex">
                          <Star className="w-5 mx-1" />
                          <h2>Avg Rating: {guide.rating}/5</h2>
                        </div>
                      </div>

                      {!session?.user ? (
                        <Link href={"/user/login"}>
                          <Button className="mt-4 mb-6">
                            Sign In to Book Guide
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          className="mt-4 mb-6"
                          type="button"
                          onClick={() => setBook(!book)}
                        >
                          {book ? "Cancel" : "Book This Guide"}
                        </Button>
                      )}

                      {book && (
                        <div className="mt-6 flex flex-col items-center justify-center w-full h-auto gap-y-2">
                          <div className="flex gap-2 items-center">
                            <span className="text-xl">Start Date</span>
                            <input
                              type="date"
                              id="date"
                              min={new Date().toISOString().split("T")[0]}
                              className="border-2 border-gray-200 outline-none px-2 rounded-md focus:border-gray-300"
                            />
                          </div>

                          <div className="flex gap-2 items-center">
                            <label className="text-xl">End Date</label>
                            <input
                              type="date"
                              id="date2"
                              min={new Date().toISOString().split("T")[0]}
                              className="border-2 border-gray-200 outline-none px-2 rounded-md focus:border-gray-300"
                            />
                          </div>
                          <Button
                            disabled={loading}
                            type="button"
                            onClick={handleBookingSubmit}
                            className="bg-green-500 w-full mt-2 my-6"
                          >
                            {loading ? "Submitting..." : "Submit"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-3">
                    <h1 className="mb-2 mx-2 text-xl font-semibold">Reviews: </h1>
                    <div
                      style={{
                        //     width: reviews.length*110,
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          // width: reviews.length * 110,
                        }}
                      >
                        {guide.reviews.length!==0 ?
                          guide.reviews.map((review) => (
                            <div
                              key={review.name}
                              className="px-3 my-2 shadow-md py-2 mr-3 min-w-64 bg-white rounded-md flex-shrink-0 flex justify-start items-start"
                            >
                              <div>
                               {review.image? <img
                                  src={review.image}
                                  alt={review.name}
                                  className="w-12 mr-4 rounded-full aspect-square"
                                />:
                                <div className="w-12 mr-4 text-white text-center text-xl font-bold flex justify-center items-center rounded-full aspect-square bg-green-500">
                                    {review.name.charAt(0)}{review.name.split("")[1] && review.name.split(" ")[1].charAt(0)}
                                </div>
                                    
                                }
                              </div>
                              <div>
                                <h1 className="text-lg font-semibold">
                                  {review.name}
                                </h1>
                                <div className="flex">
                                  <Star className="mr-3 text-green-500" />
                                  <p>{review.rating}/5</p>
                                </div>
                                <p className="font-light italic">
                                  "{review.review}"
                                </p>
                                <p className="font-light italic">
                                  Reviewed on: {review.createdAt.split("T")[0]}
                                </p>
                              </div>
                            </div>
                          )):
                          <div><h1>No Reviews to show</h1></div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GetGuidesPage;
