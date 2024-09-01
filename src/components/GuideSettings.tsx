
"use client";
import React, {  useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Nationalities from "../../Nationalities.json";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Languages from "../../Languages.json";
import { Switch } from "@/components/ui/switch"

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GuideSettings = ({ user }: any) => {
  const animatedComponents = makeAnimated();
  const [number, setNumber] = useState("");
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [available, setAvailable]=useState(true)
  const [position, setPosition]=useState({
      lat:0,
      lng:0
  })

  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleLanguageChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions.map((o: any) => o.value));
  };
  const options = Languages.map((language) => ({
    value: language,
    label: language,
  }));

  const handleSubmit = async () => {
    if (number.length !== 10) return console.log("Number should be 10 digit");

    setIsLoading(true);
    const toastid = toast.loading("Updating Data...");
    try {
      const res = await axios
        .post("/api/updateuser/guide", { contactNo: number, nationality:value,languages:selectedOptions , lat:position.lat, lng:position.lng, isActive:available })
        .then((res) => {
          if (res.data.success) {
            toast.success("Guide Updated Successfully", { id: toastid });
           
          } else {
            toast.error(res.data.message, { id: toastid });
           
          }
        });
    } catch (error) {
      toast.error("Something went Wrong!", { id: toastid });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
      async function getUser(){
            await axios.get('/api/getUser')
            .then((res)=>{
                  if(res.data.success){
                        setNumber(res.data.user.contactNo)
                        setPosition({...position, lat:res.data.user.locations[0], lng:res.data.user.locations[1]})
                        setValue(res.data.user.nationality)
                        setSelectedOptions(res.data.user.languages)
                        setAvailable(res.data.user.isActive)
                  }
            })
      }

      getUser()
  }, [])

  return (
    <div className="w-full mx-auto p-4  h-auto min-h-[calc(100vh-6rem)] flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6">
      <h2 className=" font-bold text-2xl">Guide Settings</h2>

      <form className="bg-white w-auto p-4 rounded-lg mt-5 flex flex-col gap-y-5 gap-x-4">
      <div>

      <div className="w-full flex flex-col gap-2 mb-2">
        
            <div className="flex items-center space-x-2">
            <Switch id="available" checked={available} onCheckedChange={()=>{setAvailable(!available);}}/>
            <label htmlFor="available">Available for Booking</label>
            </div>
        </div>


        <div className="w-full flex flex-col gap-2">
          <label className="font-semibold" htmlFor="">
            Contact Number
          </label>
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            type="text"
            className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
            disabled={loading}
          />
        </div>

        <div className="w-full flex flex-col gap-2 z-10">
          <label className="font-semibold" htmlFor="">
            Nationality
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
              >
                {value
                  ? Nationalities.find((nationality) => nationality === value)
                  : "Select Nationality..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search Nationality..." />
                <CommandList>
                  <CommandEmpty>No Nationality found.</CommandEmpty>
                  <CommandGroup>
                    {Nationalities.map((nationality, i) => (
                      <CommandItem
                        key={i}
                        value={value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === nationality ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {nationality}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full flex flex-col gap-2 z-10">
          <label className="font-semibold" htmlFor="">
            Languages You Speak
          </label>
          <Select
            closeMenuOnSelect={false}
            onChange={handleLanguageChange}
            components={animatedComponents}
            defaultValue={"null"}
            isMulti
            //@ts-ignore
            options={options}
          />
        </div>

      </div>

        <div className="w-full flex flex-col gap-2 z-0">
          <label className="font-semibold" htmlFor="">
            Select Your Location
          </label>
          <Map setPosition={setPosition} position={position}/>

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
        </div>
      </form>
    </div>
  );
};

const Map = ({setPosition, position}:any) => {
  const [maptype, setMaptype] = useState(0);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const customIcon = new Icon({
    iconUrl: "/pin2.png",
    iconSize: [38, 38],
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

  function GetLocation() {
    const map = useMapEvents({
      click: (e:any) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
      },
    });

    return <Marker position={position} icon={customIcon}></Marker>;
  }

  const handleClick = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  };

  return (
    <div className="w-full aspect-video">
      <MapContainer
        ref={mapRef}
        center={[27.703396, 85.315165]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={maptypes[maptype].url}
          attribution={maptypes[maptype].attribution}
        />
        <MarkerClusterGroup chunkedLoading>
          {markers && markers.map((marker: any, i: Number) => (
              <Marker
              //@ts-ignore
                key={i}
                position={[marker.geocode[0], marker.geocode[1]]}
                icon={customIcon}
              >
                <Popup>
                  <h2>{marker.popUp}</h2>
                </Popup>
                <Tooltip>{marker.popUp}</Tooltip>
              </Marker>
            ))}
        </MarkerClusterGroup>

        <GetLocation />
      </MapContainer>

      <div className="flex justify-around my-4">
        <Button
          variant="outline"
          onClick={() => {
            if (maptype === 1) setMaptype(0);
            else setMaptype(1);
          }}
          className="w-auto "
          type="button"
        >
          change Map Style
        </Button>

        <Button variant="outline" type="button" onClick={handleClick}>
          Get Current Position
        </Button>
      </div>

      <label>Lat: </label>
      <input
        value={position.lat.toFixed(3)}
        onChange={(e) =>
          setPosition({ ...position, lat: parseInt(e.target.value) })
        }
        type="number"
        className="border-2 my-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
      />
      <br />
      <label>Lng: </label>
      <input
        value={position.lat.toFixed(3)}
        onChange={(e) =>
          setPosition({ ...position, lng: parseInt(e.target.value) })
        }
        type="number"
        className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
      />
    </div>
  );
};

export default GuideSettings;
