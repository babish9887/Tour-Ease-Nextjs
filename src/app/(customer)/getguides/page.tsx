"use client"
import React, { useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function GetGuidesPage() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [guides, setGuides] = useState([]);
  const [showGuide, setShowGuide]=useState(false)
  const [book, setBook]=useState(false)
  const [loading, setLoading]=useState(false)

  const {data:session}=useSession()
  const router=useRouter()
  if(session?.user?.role=="GUIDE")
      router.replace('/')

  const [guide, setGuide]=useState({
      name:"",
      image:"",
      languages:[],
      nationality:"",
      id:""
  })

  async function handleSubmit() {
      setLoading(true)
      setGuides([])
    console.log("Submitting...");
    try {
      const res = await axios.post('/api/getguides', { lat: position.lat, lng: position.lng });
      if (res.data.success) {
            if(res.data.guides.length===0){
                  setShowGuide(false)
                  return toast.error("No guides found in this area.")
            }
        setGuides(res.data.guides);
      }
    } catch (error:any) {
      console.error('Error fetching guides:', error.message);
      toast.error("Error fetching guides.")
    } finally {
      setLoading(false)
    }
  }

  async function handleBookingSubmit(){
      setLoading(true)
      //@ts-ignore
      const date=document.getElementById("date").value
      //@ts-ignore
      const endDate=document.getElementById("date2").value
      if(new Date(date)<new Date(Date.now()) || new Date(endDate)<new Date(Date.now()))
            return toast.error("Starting Date can't be less than Today's Date")
            
      if(new Date(date)> new Date(endDate)){
            return toast.error("Starting Date can't be more than Ending Date")
      }
 
      try {
            const res = await axios.post('/api/bookguide', {guideId:guide.id, date, endDate});
            if (res.data.success) {
                  toast.success("User is Booked")
            } else
                  toast.error(res.data.message)

          } catch (error:any) {
            console.error('Error Booking guide:', error.message);
          } finally {
            setLoading(false)
          }
  }

  return (
    <>
      <div className='h-24' />
      <div className='flex justify-center items-center  flex-col md:flex-row flex-wrap bg-transparent relative overflow-hidden'>
     
       <div className='w-full flex flex-col justify-center items-center '>
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
      <div className=' backdrop-blur-3xl min-h-[calc(100vh-12rem)] w-full flex flex-col md:flex-row justify-center items-start relative'>




            <div className='w-full md:w-1/2 h-full p-4 '>
                  <Map loading={loading} setGuide={setGuide} setPosition={setPosition} showGuide={showGuide} setShowGuide={setShowGuide} position={position} handleSubmit={handleSubmit} guides={guides} />

            </div>
            <div className='w-full md:w-1/2 h-full p-4 md:py-10 md:px-4 '>
            {/* {guides.length===0 && guide && <div>No guides Available</div>} */}
            {guide && showGuide && 
            <div className='flex justify-around items-center flex-col h-auto min-h-32 '>
                  <div className='flex justify-around items-center gap-y-3 gap-x-2'>
                  <img src={guide?.image} alt={guide.name} className='rounded-full w-16 aspect-square'/>
                  <h1 className='text-3xl'>{guide.name}</h1>
                  </div>
                  <div className='mb-4'>
                        <h2>Lanuages:{guide.languages.join(", ")}</h2>
                        <h2>Nationality:{guide.nationality}</h2>
                        <h2>Avg Rating: N/A</h2>
                  </div>

                  <Button type='button' onClick={()=>setBook(true)} >Book This Guide</Button>

                  {book &&
                  <div className=' mt-6 flex flex-col items-center justify-center w-full h-auto gap-y-2'>
                       <div className='flex gap-2 items-center'>
                       <span className='text-xl'>Start Date</span>
                       <input type='date' id="date"  className="border-2 border-gray-200 outline-none px-2 rounded-md focus:border-gray-300"/>
                       </div>

                       <div className='flex gap-2 items-center'>
                       <label className='text-xl'>End Date</label>
                       <input type='date' id="date2"  className="border-2 border-gray-200 outline-none px-2 rounded-md focus:border-gray-300"/>
                       </div>
                        <Button disabled={loading} type='button' onClick={handleBookingSubmit} className='bg-green-500'>{loading? "Submitting..." :"Submit"}</Button>
                  </div>}
            </div>}
            </div>
      </div>
      
      </div>


    </>
  );
}

const Map = ({ setPosition, position, handleSubmit, guides, showGuide, setShowGuide, setGuide, loading }:any) => {
  const [maptype, setMaptype] = useState(0);
  const mapRef = useRef(null);

  const customIcon = new Icon({
    iconUrl: "/pin2.png",
    iconSize: [32, 32]
  });

  const maptypes = [
      {
      name: "default",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      },
      {
            name: "WorldImagery",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      },
];

  // Function to handle click event on map to set position
  function GetLocation() {
    const map = useMapEvents({
      click: (e:any) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat:lat+0.0001, lng });
      }
    });

    //@ts-ignore
    return <Marker position={position} icon={customIcon}></Marker>;
  }

  // Function to handle getting current geolocation
  const handleClick = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }

  const handlePopupClick=async(e:any,marker:any)=>{
      e.stopPropagation()
      setShowGuide(true)
      setGuide(marker)
  }

  // Render the map component
  return (
    <div className='h-auto w-full overflow-hidden z-10'>
      <MapContainer ref={mapRef} center={[27.703396, 85.315165]} zoom={13} scrollWheelZoom={true} className='z-10'>
        <TileLayer
          url={maptypes[maptype].url}
          attribution={maptypes[maptype].attribution}
        />

        <MarkerClusterGroup chunkedLoading>
          {guides && guides.map((marker:any, i:number) => (
            <Marker key={i} position={[marker.locations[0], marker.locations[1]]} icon={customIcon}>
              <Popup >
                  <div className='cursor-pointer flex justify-between items-center gap-x-3' onClick={(e)=>handlePopupClick(e,marker)}>
                  <img src={marker.image} alt={marker.name} className='w-12 aspect-square rounded-full'/>
                <h2 className='font-semibold text-xl'>{marker.name}</h2>
                  </div>
              </Popup>
              {/* <Tooltip>{marker.name}</Tooltip> */}
            </Marker>
          ))}
        </MarkerClusterGroup>

        <GetLocation />

      </MapContainer>

<div className='mt-4 mb-4 flex flex-wrap gap-y-4 gap-x-2'>
      <div className='w-full flex'>

     <div className='w-1/2'>
      <label>Lat: </label>
     <input type='text' value={position.lat.toFixed(3)} style={{ color: "black" }} readOnly  className='border-2 w-4/5 border-gray-200 outline-none px-2 py-1 rounded-md focus:border-gray-300'/>
     </div>

     <div className='w-1/2'>
      <label>Lng: </label>
      <input type='text' value={position.lng.toFixed(3)} style={{ color: "black" }} readOnly className='border-2 w-4/5 border-gray-200 outline-none px-2 py-1 rounded-md focus:border-gray-300'/>
     </div>
      </div>
      <Button type='button' variant="secondary" className='mx-2 text-green-600 hover:text-green-700' onClick={handleClick}>Get Current Position</Button>

      <Button type='button' variant="secondary" onClick={() => setMaptype(maptype === 1 ? 0 : 1)} className=' text-green-600 hover:text-green-700'>
        Change Map Style
      </Button>

</div>

      <Button disabled={loading} type='button' onClick={handleSubmit} className='bg-green-500 hover:bg-green-600'>Submit</Button>

    </div>
  );
}

export default GetGuidesPage;
