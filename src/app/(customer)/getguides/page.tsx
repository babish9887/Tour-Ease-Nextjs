"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../../../components/ui/button';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from '../.../../../../lib/schema';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid server-side rendering
const Map = dynamic(() => import('../../../components/Map').then((mod) => mod.Map), {
      ssr: false
    });

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
      router.replace('/');
    }
  }, [session, router]);

  const [guide, setGuide] = useState({
    name: "",
    image: "",
    languages: [],
    nationality: "",
    id: ""
  });

  async function handleSubmit() {
    setLoading(true);
    setGuides([]);
    console.log("Submitting...");
    try {
      const res = await axios.post('/api/getguides', { lat: position.lat, lng: position.lng });
      if (res.data.success) {
        if (res.data.guides.length === 0) {
          setShowGuide(false);
          return toast.error("No guides found in this area.");
        }
        setGuides(res.data.guides);
      }
    } catch (error: any) {
      console.error('Error fetching guides:', error.message);
      toast.error("Error fetching guides.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBookingSubmit() {
    setLoading(true);
    const date = (document.getElementById("date") as HTMLInputElement).value;
    const endDate = (document.getElementById("date2") as HTMLInputElement).value;

    if (new Date(date) < new Date(Date.now()) || new Date(endDate) < new Date(Date.now())) {
      return toast.error("Starting Date can't be less than Today's Date");
    }
    
    if (new Date(date) > new Date(endDate)) {
      return toast.error("Starting Date can't be more than Ending Date");
    }

    try {
      const res = await axios.post('/api/bookguide', { guideId: guide.id, date, endDate });
      if (res.data.success) {
        toast.success("User is Booked");
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.error('Error Booking guide:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='h-24' />
      <div className='flex justify-center items-center flex-col md:flex-row flex-wrap bg-transparent relative overflow-hidden'>
        <div className='w-full flex flex-col justify-center items-center'>
          <h1 className='font-semibold text-3xl'>Get Guides</h1>
          <h2 className='my-2'>Pin on the Map where you want to visit! Then we will find nearby guides for you.</h2>
        </div>
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-[calc(50%)] aspect-[1155/678] w-[48rem] -translate-x-1/2 rotate-[80deg] md:rotate-[30deg] bg-gradient-to-tr from-[#59e68f] to-[#30d3bd] opacity-70 sm:opacity-30 sm:left-[calc(20%)] sm:w-[60rem] md:w-[80rem] md:-top-12 lg:w-[120rem] lg:-top-10 "
        />
        <div className='backdrop-blur-3xl min-h-[calc(100vh-12rem)] w-full flex flex-col md:flex-row justify-center items-start relative'>
          <div className='w-full md:w-1/2 h-full p-4'>
            <Map setGuide={setGuide} setPosition={setPosition} showGuide={showGuide} setShowGuide={setShowGuide} position={position} handleSubmit={handleSubmit} guides={guides} />
          </div>
          <div className='w-full md:w-1/2 h-full p-4 md:py-10 md:px-4'>
            {guide && showGuide &&
              <div className='flex justify-around items-center flex-col h-auto min-h-32'>
                <div className='flex justify-around items-center gap-y-3 gap-x-2'>
                  <img src={guide?.image} alt={guide.name} className='rounded-full w-16 aspect-square' />
                  <h1 className='text-3xl'>{guide.name}</h1>
                </div>
                <div className='mb-4'>
                  <h2>Languages: {guide.languages.join(", ")}</h2>
                  <h2>Nationality: {guide.nationality}</h2>
                  <h2>Avg Rating: N/A</h2>
                </div>

                {(!session?.user) ?
                  <Link href={'/user/login'}>
                    <Button>Sign In to Book Guide</Button>
                  </Link>
                  :
                  <Button type='button' onClick={() => setBook(true)}>Book This Guide</Button>
                }

                {book &&
                  <div className='mt-6 flex flex-col items-center justify-center w-full h-auto gap-y-2'>
                    <div className='flex gap-2 items-center'>
                      <span className='text-xl'>Start Date</span>
                      <input type='date' id="date" min={new Date().toISOString().split('T')[0]} className="border-2 border-gray-200 outline-none px-2 rounded-md focus:border-gray-300" />
                    </div>

                    <div className='flex gap-2 items-center'>
                      <label className='text-xl'>End Date</label>
                      <input type='date' id="date2" min={new Date().toISOString().split('T')[0]} className="border-2 border-gray-200 outline-none px-2 rounded-md focus:border-gray-300" />
                    </div>
                    <Button disabled={loading} type='button' onClick={handleBookingSubmit} className='bg-green-500'>{loading ? "Submitting..." : "Submit"}</Button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default GetGuidesPage;
