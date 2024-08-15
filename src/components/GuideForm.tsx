
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
import { signIn, useSession } from "next-auth/react";
import { Session  } from "@/lib/schema";

const GuideForm = ({ user }: any) => {
// const [session, setSession]=useState(undefined)
  const animatedComponents = makeAnimated();
  const [number, setNumber] = useState("");
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [position, setPosition]=useState({
      lat:0,
      lng:0
  })
  const [sessionState, setSessionState] = useState(null);
  const {data, update}=useSession()
  const session:Session | null=data
  console.log(update)

  const [name, setName]=useState("")
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")

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
    const toastid = toast.loading("Registering User...");
    try {
      if(session?.user){
      const res = await axios
        .post("/api/register/guide", { contactNo: number, nationality:value,languages:selectedOptions , lat:position.lat, lng:position.lng })
        .then(async (res) => {
          if (res.data.success) {
            toast.success("Guide Registered", { id: toastid });
            await update({
                  ...session,
                  user:{
                        ...session.user,
                        role:"GUIDE"
                  }
            })
            setTimeout(() => {
              router.replace("/");
            }, 3000);
          } else {
            toast.error(res.data.message, { id: toastid });
            setTimeout(() => {
              router.replace("/");
            }, 3000);
          }
        });}
        else {
            const res = await axios
            .post("/api/credential/guide", {name, email, password, contactNo: number, nationality:value,languages:selectedOptions , lat:position.lat, lng:position.lng })
            .then((res) => {
              if (res.data.success) {
                toast.success("User Registered! Check Your Email for Verification!", { id: toastid });
                setTimeout(() => {
                  router.replace("/");
                }, 3000);
              } else {
                toast.error(res.data.message, { id: toastid });
                setTimeout(() => {
                  router.replace("/");
                }, 3000);
              }
            });}
    } catch (error) {
      toast.error("Something went Wrong!", { id: toastid });
    } finally {
      setIsLoading(false);
    }
  };
  if((session?.user && user.emailVerified!==null) && session?.user?.role!==null){
      router.push('/')
      return <div className="w-full mx-auto p-4  h-auto min-h-screen flex flex-col justify-center sm:w-2/3 md:w-4/6 lg:w-3/6">
            <h1>User With The Email Already and Verified. Redirecting to Home Page</h1>
      </div>
  }

  return (
    <div className="w-full mx-auto p-4  h-auto min-h-screen flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6">
      <h2 className=" font-bold text-2xl">Register your account!</h2>
      <h4 className="  text-md">As a Guide</h4>

      <form className="bg-white w-auto p-4 rounded-lg mt-5 flex flex-col gap-y-5 gap-x-4">
      {session?.user==null && 
                        <>
                        <div className="w-full flex flex-col gap-2">
                              <label className="font-semibold" htmlFor="">
                                    Full Name
                              </label>
                              <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                                    disabled={loading}
                              />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                              <label className="font-semibold" htmlFor="">
                                    Email
                              </label>
                              <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                                    disabled={loading}
                              />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                              <label className="font-semibold" htmlFor="">
                                    Password
                              </label>
                              <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                                    disabled={loading}
                              />
                        </div>
                        </>
                        }
      <div>
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
                        value={nationality}
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

          {session?.user==null && 
                        <>
                        <Button type="button" onClick={()=>signIn("google", {callbackUrl:"http://localhost:3000/newuser/guideSignup"})} disabled={loading} variant="ghost">
                              Continue with Google
                        </Button>
                        
            </>}
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
        console.log(e);
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
          variant="secondary"
          onClick={() => {
            if (maptype === 1) setMaptype(0);
            else setMaptype(1);
          }}
          className="w-auto "
          type="button"
        >
          change Map Style
        </Button>

        <Button variant="secondary" type="button" onClick={handleClick}>
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

export default GuideForm;
