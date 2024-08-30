import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import { Button } from './ui/button';

type MapProps = {
      setPosition: (position: { lat: number; lng: number }) => void;
      position: { lat: number; lng: number };
      handleSubmit: () => void;
      guides: any[];
      showGuide: boolean;
      loading:boolean,
      setShowGuide: (show: boolean) => void;
      setGuide: (guide: any) => void;
      setLoading: (guide: any) => void;

    };

export const Map:React.FC<MapProps> = ({  setPosition, position, handleSubmit, guides, showGuide, setShowGuide, setGuide, loading:upperLoading, setLoading:UpperSetLoading }: any) => {
  const [maptype, setMaptype] = useState(0);
  const mapRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading]=useState(false)

  useEffect(() => {
    // This will only run on the client
    setIsClient(true);
  }, []);

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
     useMapEvents({
      click: (e: any) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat: lat + 0.0001, lng });
      }
    });

    return <Marker position={position} icon={customIcon}></Marker>;
  }

  // Function to handle getting current geolocation
  const handleClick = () => {
      setLoading(true)
    if (typeof window !== 'undefined') {
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
      setLoading(false)
    }
  };

  const handlePopupClick = (e: any, marker: any) => {
    e.stopPropagation();
    if(!marker.isActive) return;
    setShowGuide(true);
    setGuide(marker);
  };

  if (!isClient) return null;

  return (
    <div className='h-auto w-full overflow-hidden z-10'>
      <MapContainer ref={mapRef} center={[27.703396, 85.315165]} zoom={13} scrollWheelZoom={true} className='z-10'>
        <TileLayer
          url={maptypes[maptype].url}
          attribution={maptypes[maptype].attribution}
        />

        <MarkerClusterGroup chunkedLoading>
          {guides && guides.map((marker: any, i: number) => (
            <Marker key={i} position={[marker.locations[0], marker.locations[1]]} icon={customIcon}>
              <Popup>
                <div className='cursor-pointer flex justify-between items-center gap-x-3 ' onClick={(e) => handlePopupClick(e, marker)}>
                  <img src={marker.image} alt={marker.name} className={`w-12 aspect-square rounded-full filter ${marker.isActive? "": "filter grayscale"}`} />
                  <h2 className='font-semibold text-lg'>{marker.name}</h2>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <Circle
          center={{ lat: position.lat, lng: position.lng }}
          fillColor="blue"
          radius={5100} />

        <GetLocation />
      </MapContainer>

      <div className='mt-4 mb-4 flex flex-wrap gap-y-4 gap-x-2'>
        <div className='w-full flex'>
          <div className='w-1/2'>
            <label>Lat: </label>
            <input type='text' value={position.lat.toFixed(3)} style={{ color: "black" }} readOnly className='border-2 w-4/5 border-gray-200 outline-none px-2 py-1 rounded-md focus:border-gray-300' />
          </div>

          <div className='w-1/2'>
            <label>Lng: </label>
            <input type='text' value={position.lng.toFixed(3)} style={{ color: "black" }} readOnly className='border-2 w-4/5 border-gray-200 outline-none px-2 py-1 rounded-md focus:border-gray-300' />
          </div>
        </div>
        <Button type='button' variant="secondary" className='mx-2 text-green-600 hover:text-green-700' onClick={handleClick}>Get Current Position</Button>
        <Button type='button' variant="secondary" onClick={() => setMaptype(maptype === 1 ? 0 : 1)} className=' text-green-600 hover:text-green-700'>
          Change Map Style
        </Button>
      </div>

      <Button disabled={upperLoading} type='button' onClick={handleSubmit} className='bg-green-500 hover:bg-green-600'>{upperLoading? "Submitting...":"Submit"}</Button>
    </div>
  );
}
