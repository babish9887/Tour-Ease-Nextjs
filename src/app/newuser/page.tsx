"use client"
import {  useSession } from 'next-auth/react'
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { FaShoppingBag } from "react-icons/fa";
import { FaTag } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function NewUserPage() {
      const router = useRouter();
      const [isBuyer, setIsBuyer] = useState(true);
      const [isLoading, setIsLoading]=useState(true);
      const handleClick = () => {
        if (isBuyer) {
          router.push("/newuser/touristSignup");
        } else {
          router.push("/newuser/guideSignup");
        }
      };
      return (
            <div className="w-11/12 lg:w-1/3 md:w-2/3 h-screen flex justify-center items-center mx-auto ">
              <div className="flex flex-col">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Explore the World with a Local Guide
                </h2>
                <p className="mt-5 text-gray-600">
                Discover unique destinations with experienced guides or offer your expertise as a local guide.
                </p>
        
                <div className="mt-10 flex flex-col w-full justify-between gap-10 ">
                  <div
                    className={`flex w-full items-center gap-3 px-5 py-5 rounded-md bg-white cursor-pointer ${
                      isBuyer ? "ring-2 ring-green-500" : null
                    }  ${isLoading? " text-gray-400 ring-gray-300":null}`}
                    onClick={() => setIsBuyer(true)}
                  >
                    <FaShoppingBag className="w-12 h-10 text-white bg-green-500 p-2 rounded-lg" />
                    <div className="flex flex-col w-full">
                      <h2 className="text-lg font-semibold uppercase">Tourist</h2>
                      <p className="text-sm text-gray-500">I want to be Tourist</p>
                    </div>
                    <IoIosArrowForward className="w-6 h-6 justify-self-end" />
                  </div>
        
                  <div
                    onClick={() => setIsBuyer(false)}
                    className={`flex w-full items-center gap-3 px-5 py-5 rounded-md bg-white cursor-pointer ${
                      !isBuyer ? "ring-2 ring-green-600" : null
                    }  ${isLoading? " text-gray-400 ring-gray-300":null}`}
                  >
                    <FaTag className="w-12 h-10 text-white bg-green-500 p-2 rounded-lg" />
                    <div className="flex flex-col w-full">
                      <h2 className="text-lg font-semibold uppercase">Guide</h2>
                      <p className="text-sm text-gray-500">
                        I want to Guide the Tourist
                      </p>
                    </div>
                    <IoIosArrowForward className="w-6 h-6 justify-self-end" />
                  </div>
        
                  <Button className="text-md text-white" onClick={() => handleClick()} >
                    Continue <IoIosArrowForward className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          );
}

export default NewUserPage