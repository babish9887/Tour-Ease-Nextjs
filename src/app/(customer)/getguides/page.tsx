"use client"
import React, { useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { Button } from '@/components/ui/button';

function GetGuidesPage() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [guides, setGuides] = useState([]);

  async function handleSubmit() {
    console.log("Submitting...");
    try {
      const res = await axios.post('/api/getguides', { lat: position.lat, lng: position.lng });
      if (res.data.success) {
        setGuides(res.data.guides);
      }
    } catch (error:any) {
      console.error('Error fetching guides:', error.message);
    }
  }

  return (
    <>
      <div className='h-24' />
      <div className='min-h-[calc(100vh-6rem)] w-full flex flex-col justify-center items-center'>
        <h1 className='font-semibold text-3xl'>Get Guides</h1>
        <h2 className='my-3'>Pin on the Map where you want to visit! Then we will find nearby guides for you.</h2>

        <div className='min-w-[300px] w-auto max-w-[800px] aspect-square'>
          <Map setPosition={setPosition} position={position} handleSubmit={handleSubmit} guides={guides} />
        </div>

      </div>
    </>
  );
}

const Map = ({ setPosition, position, handleSubmit, guides }:any) => {
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

  // Render the map component
  return (
    <div className='h-auto w-full overflow-hidden z-10'>
      <MapContainer ref={mapRef} center={[27.703396, 85.315165]} zoom={13} scrollWheelZoom={true} className='z-10'>
        <TileLayer
          url={maptypes[maptype].url}
          attribution={maptypes[maptype].attribution}
        />

        <MarkerClusterGroup chunkedLoading>
          {guides.map((marker:any, i:number) => (
            <Marker key={i} position={[marker.locations[0], marker.locations[1]]} icon={customIcon}>
              <Popup>
                <h2>{marker.name}</h2>
              </Popup>
              <Tooltip>{marker.name}</Tooltip>
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
