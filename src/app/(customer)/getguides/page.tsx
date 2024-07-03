"use client"
import React, { useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

function GetGuidesPage() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [guides, setGuides] = useState([]);
  const [showGuide, setShowGuide]=useState(false)
  const [book, setBook]=useState(false)
  const [guide, setGuide]=useState({
      name:"",
      image:"",
      languages:[],
      nationality:"",
      id:""
  })

  async function handleSubmit() {
    console.log("Submitting...");
    try {
      const res = await axios.post('/api/getguides', { lat: position.lat, lng: position.lng });
      if (res.data.success) {
        setGuides(res.data.guides);
        console.log(res.data.guides)
      }
    } catch (error:any) {
      console.error('Error fetching guides:', error.message);
    }
  }

  async function handleBookingSubmit(){
      //@ts-ignore
      const date=document.getElementById("date").value
      //@ts-ignore
      const endDate=document.getElementById("date2").value
      //@ts-ignore
      const duration=document.getElementById("duration").value

      try {
            const res = await axios.post('/api/bookguide', {guideId:guide.id, date, duration, endDate});
            if (res.data.success) {
                  toast.success("User is Booked")
            } else
            toast.error(res.data.message)

          } catch (error:any) {
            console.error('Error fetching guides:', error.message);
          }
  }

  return (
    <>
      <div className='h-24' />
      <div className='flex justify-center  flex-col md:flex-row flex-wrap'>
       <div className='w-full flex flex-col justify-center '>
       <h1 className='font-semibold text-3xl'>Get Guides</h1>
        <h2 className='my-3'>Pin on the Map where you want to visit! Then we will find nearby guides for you.</h2>

       </div>
      <div className='min-h-[calc(100vh-6rem)] w-auto flex flex-col justify-center items-center'>

        <div className='min-w-[300px] w-auto max-w-[800px] aspect-square'>
          <Map setGuide={setGuide} setPosition={setPosition} showGuide={showGuide} setShowGuide={setShowGuide} position={position} handleSubmit={handleSubmit} guides={guides} />
        </div>
      </div>
      <div className=' w-full md:w-2/5 bg-slate-300 h-72 '>
            {guide && showGuide && 
            <div className='flex justify-around items-center flex-col h-auto min-h-32 '>
                  <div className='flex justify-around items-center gap-y-3'>
                  <img src={guide?.image} alt={guide.name} className='rounded-full w-16 aspect-square'/>
                  <h1>{guide.name}</h1>
                  </div>
                  <div>
                        <h2>Lanuages:{guide.languages.join(", ")}</h2>
                        <h2>Nationality:{guide.nationality}</h2>
                  </div>

                  <Button type='button' onClick={()=>setBook(true)}>Book This Guide</Button>

                  {book &&
                  <div>
                        <input type='date' id="date"/>
                        <input type='date' id="date2"/>

                        <input type='number' id="duration"/>
                        <Button type='button' onClick={handleBookingSubmit}>Submit</Button>
                  </div>}
            </div>}
      </div>
      </div>

    </>
  );
}

const Map = ({ setPosition, position, handleSubmit, guides, showGuide, setShowGuide, setGuide }:any) => {
  const [maptype, setMaptype] = useState(0);
  const mapRef = useRef(null);

  const customIcon = new Icon({
    iconUrl: "/pin2.png",
    iconSize: [38, 38]
  });

  const maptypes = [
    {
      name: "WorldImagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    },
    {
      name: "default",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ];

  // Function to handle click event on map to set position
  function GetLocation() {
    const map = useMapEvents({
      click: (e:any) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
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
      <input type='text' value={position.lat.toFixed(3)} style={{ color: "black" }} readOnly  className='border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300'/>
      <input type='text' value={position.lng.toFixed(3)} style={{ color: "black" }} readOnly className='border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300'/>
      <Button type='button' variant="secondary" className='mx-2' onClick={handleClick}>Get Current Position</Button>

      <Button type='button' variant="secondary" onClick={() => setMaptype(maptype === 1 ? 0 : 1)} className=''>
        Change Map Style
      </Button>

</div>

      <Button type='button' onClick={handleSubmit}>Submit</Button>

    </div>
  );
}

export default GetGuidesPage;
