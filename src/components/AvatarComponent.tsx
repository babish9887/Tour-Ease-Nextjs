"use client";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Button } from "./ui/button";
import { LuLogOut, LuSettings2 } from "react-icons/lu";
import { signOut } from "next-auth/react";
import { Settings, Settings2Icon } from "lucide-react";
import Link from "next/link";
const AvatarComponent = ({ altName, img, list, email }:any) => {
  return (
      //@ts-ignore
    <DropdownMenu className="w-full flex " >
      <DropdownMenuTrigger className="outline-none border-none" >
        <Avatar>
          <AvatarImage src={img} />
          <AvatarFallback className="bg-green-500 text-white">
            {altName && altName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto  p-2 mr-4 mt-4 flex flex-col items-center bg-white/40 backdrop-blur-2xl border-none">
        <DropdownMenuLabel className="text-sm font-normal truncate text-black">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {list &&
          list.length > 0 &&
          list.map((data:any, i:number) => {
            return <DropdownMenuItem key={i}>{data}</DropdownMenuItem>;
          })}

        <DropdownMenuItem className="  bg-transparent hover:bg-transparent focus:bg-transparent">
            <div className="gap-y-1 flex flex-col ">
            <Button className="text-white w-full" onClick={()=>signOut()}>
              <LuLogOut className="mr-2" /> Logout
            </Button>
            <Link href="/account">
            <Button className="text-white w-full">
              <LuSettings2 className="mr-2" /> Settings
            </Button>
            </Link>
            </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarComponent;
