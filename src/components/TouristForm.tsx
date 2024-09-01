"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Nationalities from "../../Nationalities.json";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const TouristForm = ({ user }: any) => {
      const {data:session , update}=useSession()
      const router = useRouter();
      const [loading, setIsLoading] = useState(false);
      const [open, setOpen] = useState(false);
      
      //input values
      const [name, setName]=useState("")
      const [email, setEmail]=useState("")
      const [password, setPassword]=useState("")

      const [number, setNumber] = useState("");
      const [value, setValue] = useState("");

      const handleSubmit = async () => {
            if (number.length !== 10) return console.log("Number should be 10 digit");

            setIsLoading(true);
            const toastid = toast.loading("Registering...");
            try {
                 if(session?.user){
                  await axios
                  .post("/api/register/tourist", { contactNo: number, nationality:value })
                  .then(async (res) => {
                        if (res.data.success) {
                              toast.success("User Registered", { id: toastid });
                              await update({
                                    ...session,
                                    user:{
                                          ...session.user,
                                          role:"USER"
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
                  });
                  }
                  else {
                        await axios
                        .post("/api/credential/tourist", {name, email, password, contactNo: number, nationality:value })
                        .then((res) => {
                              if (res.data.success) {
                                    toast.success("User Registered! Check Your Email for Verification!", { id: toastid });
                                    setTimeout(() => {
                                          router.replace("/");
                                          
                                          // window.location.reload();

                                    }, 3000);
                              } else {
                                    toast.error(res.data.message, { id: toastid });
                                    setTimeout(() => {
                                          router.replace("/");
                                          //  window.location.reload();

                                    }, 3000);
                              }
                        });
                  }

            } catch (error) {
                  console.log(error);
                  toast.error("Something went Wrong!", { id: toastid });
            } finally {
                  setIsLoading(false);
            }
      };

      if(session?.user && user.emailVerified!==null){
            router.push('/')
            return <div className="w-full mx-auto p-4  h-auto min-h-screen flex flex-col justify-center sm:w-2/3 md:w-4/6 lg:w-3/6">
                  <h1>User With The Email Already and Verified. Redirecting to Home Page</h1>
            </div>
        }
      
      return (
            <div className="w-full mx-auto p-4  h-screen flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6">
                  <h2 className=" font-bold text-2xl">{user? "Register your account!" : "Sign Up" }</h2>
                  <form className="bg-white p-4 rounded-lg mt-5 flex flex-col gap-y-5">
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

                        <div className="w-full flex flex-col gap-2">
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

                        {session?.user==null && 
                        <>
                        <Button type="button" onClick={()=>signIn("google", {callbackUrl:"http://localhost:3000/newuser/touristSignup"})} disabled={loading} variant="ghost">
                              Continue with Google
                        </Button>
                        
                        </>}

                        <Button type="button" onClick={handleSubmit} disabled={loading}>
                              Submit
                        </Button>
                  </form>
            </div>
      );
};

export default TouristForm;
