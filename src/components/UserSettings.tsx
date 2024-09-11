"use client";
import React, { useEffect, useState } from "react";
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

const UserSettings = ({ user }: any) => {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  //input values
  const [number, setNumber] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (number.length !== 10) return toast.error("Number should be 10 digit");

    const toastid = toast.loading("Updating User...");
    try {
      setIsLoading(true);
      await axios
        .post("/api/updateuser/tourist", {
          contactNo: number,
          nationality: value,
        })
        .then((res) => {
          if (res.data.success) {
            toast.success("User Updated Successfully", { id: toastid });
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
    async function getUser() {
      await axios.get("/api/getUser").then((res) => {
        if (res.data.success) {
          setNumber(res.data.user.contactNo);
          setValue(res.data.user.nationality);
        }
      });
    }

    getUser();
  }, []);

  return (
    <div className="w-full mx-auto p-4  h-[calc(100vh-6rem)] flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6 ">
      <h2 className=" font-bold text-2xl">Update User Settings</h2>
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

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UserSettings;
