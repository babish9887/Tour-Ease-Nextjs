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

const TouristForm = ({ user }: any) => {
      console.log(user);
      const router = useRouter();
      const [loading, setIsLoading] = useState(false);
      const [open, setOpen] = useState(false);

      //input values
      const [number, setNumber] = useState("");
      const [value, setValue] = useState("");

      const handleSubmit = async () => {
            if (number.length !== 10) return console.log("Number should be 10 digit");

            setIsLoading(true);
            const toastid = toast.loading("Registering...");
            try {
                  await axios
                        .post("/api/register/tourist", { contactNo: number, nationality:value })
                        .then((res) => {
                              console.log(res);
                              if (res.data.success) {
                                    toast.success("User Registered", { id: toastid });
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
            } catch (error) {
                  toast.error("Something went Wrong!", { id: toastid });
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <div className="w-full mx-auto p-4  h-screen flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6">
                  <h2 className=" font-bold text-2xl">Register your account!</h2>
                  <form className="bg-white p-4 rounded-lg mt-5 flex flex-col gap-y-5">
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

                        <Button type="button" onClick={handleSubmit}>
                              Submit
                        </Button>
                  </form>
            </div>
      );
};

export default TouristForm;
