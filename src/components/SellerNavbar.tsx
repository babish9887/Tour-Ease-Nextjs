"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

import AvatarComponent from "./AvatarComponent";
import { LuLogOut } from "react-icons/lu";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

const SellerNavbar = () => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const router=useRouter()
const {data:session}=useSession()
console.log(session)

useEffect(()=>{
      //@ts-ignore
      if(session?.user?.role===null){
            toast.error("Your account signup is incomplete! Please complete the registration process.", {duration:5000})
            setTimeout(()=>{
                  router.replace('/newuser')
            },2000)
      }
},[session])

  return (
    <nav className="flex justify-between flex-col sm:flex-row items-center py-2 fixed w-[calc(100vw-2rem)] top-2 mr-4 ml-4 z-50 bg-transparent">
      <div className="flex backdrop-blur-2xl grainy/90 bg-slate-100/40 justify-between w-full sticky top-0 h-[4.5rem] items-center px-4 py-2 rounded-xl shadow-md">
        <Link href={"/"} className=" font-extrabold text-xl uppercase text-green-600">
          Tour Ease
        </Link>
        <div className="cursor-pointer">
          {openMenu ? (
            <FaXmark
              className="h-8 w-8 sm:hidden transition-all"
              onClick={() => setOpenMenu((openMenu) => !openMenu)}
            />
          ) : (
            <GiHamburgerMenu
              className="h-8 w-8 sm:hidden transition-al"
              onClick={() => setOpenMenu((openMenu) => !openMenu)}
            />
          )}
        </div>

        <div className="sm:flex md:gap-6 sm:gap-2 items-center hidden font-semibold">
          <Link
            className={`hover:bg-gray-200/70 px-3 py-2 rounded-md ${
              pathName === "/" ? "text-green-600" : null
            }`}
            href={"/"}
          >
            Home
          </Link>
          {/* <Link
            className={`hover:bg-gray-200/70 px-3 py-2 rounded-md ${
              pathName === "/getguides" ? "text-green-600" : null
            }`}
            href={"/getguides"}
          >
            Get Guides
          </Link> */}
          <Link
            className={`hover:bg-gray-200/70 px-3 py-2 rounded-md ${
              pathName === "/mybookings" ? "text-green-600" : null
            }`}
            href={"/mybookings"}
          >
            My Bookings
          </Link>
         
          {session?.user ? (
            <AvatarComponent
              img={session.user.image}
              altName={session.user.name}
              email={session.user.email}
            />
          ) : (
            <div className="flex gap-3">
                <Button variant={"outline"} className="font-semibold" onClick={()=>signIn("google", {callbackUrl:"http://localhost:3000/newuser"})}>
                  Sign up
                </Button>

                <Button onClick={()=>signIn("google")}>Sign in</Button>
            </div>
          )}
        </div>
      </div>
      {openMenu ? (
        <div className="mt-20 flex sm:flex-none absolute z-20 flex-col bg-white/40 backdrop-blur-2xl w-full items-center justify-between rounded-2xl p-4 gap-2 shadow-md font-semibold sm:hidden animate-navbar-down grainy">
          <Link
            href={"/"}
            className={`hover:bg-gray-200/70 px-3 py-2 rounded-md ${
              pathName === "/" ? "text-green-600" : null
            }`}
            onClick={() => setOpenMenu(false)}
          >
            Home
          </Link>
          <Link
            href={"/getguides"}
            className={`hover:bg-gray-200/70 px-3 py-2 rounded-md ${
              pathName === "/getguides" ? "text-green-600" : null
            }`}
            onClick={() => setOpenMenu(false)}
          >
            My Bookings
          </Link>
          {/* <Link
            href={"/mybookings"}
            className={`hover:bg-gray-200/70 px-3 py-2 rounded-md ${
              pathName === "/mybookings" ? "text-green-600" : null
            }`}
            onClick={() => setOpenMenu(false)}
          >
           
          </Link> */}
          {session?.user ? (
              <Button onClick={()=>signOut()}>
                {" "}
                <LuLogOut className="mr-2 w-4 h-4" /> Logout
              </Button>
          ) : (
            <div className="flex gap-3" >
                <Button variant={"outline"} className="font-semibold" onClick={()=>{signIn("google", {callbackUrl:"http://localhost:3000/newuser"})}}>
                  Sign up
                </Button>

                <Button onClick={()=>{signIn("google")}}>Sign in</Button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
};

export default SellerNavbar;
