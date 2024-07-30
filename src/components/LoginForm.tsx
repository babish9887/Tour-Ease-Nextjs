"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { signIn, useSession } from "next-auth/react";

const LoginForm = ({ user }: any) => {
      const {data:session}=useSession()
      console.log(session)
      const router = useRouter();
      const [loading, setIsLoading] = useState(false);
      const [open, setOpen] = useState(false);
      
      //input values
      const [email, setEmail]=useState("")
      const [password, setPassword]=useState("")
      const handleSubmit = async () => {

            setIsLoading(true);
            const toastid = toast.loading("Logging...");
            try {
                  await signIn('credentials', {email, password, redirect: false})
                  .then((res)=>{
                        if(res?.error)
                              toast.error('Invalid credentials', {id:toastid})
                        if(res?.ok && !res?.error){
                              toast.success('Logged in!', {id:toastid})
                              router.replace('/')
                         router.refresh();
                        }
                  })
                  .finally(()=>{
                        setIsLoading(false)
                  })
            } catch (error) {
                  toast.error("Something went Wrong!", { id: toastid });
            } finally {
                  setIsLoading(false);
            }
      };

      
      return (
            <div className="w-full mx-auto p-4  h-screen flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6">
                  <h2 className=" font-bold text-2xl">Login your Account</h2>
                  <form className="bg-white p-4 rounded-lg mt-5 flex flex-col gap-y-5">
                        
                        <div className="w-full flex flex-col gap-2">
                              <label className="font-semibold" htmlFor="">
                                    Email
                              </label>
                              <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
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
                  
                        <Button type="button" onClick={()=>signIn("google", {callbackUrl:"http://localhost:3000/"})} disabled={loading} variant="ghost">
                              Continue with Google
                        </Button>
                        
                        <Button type="button" onClick={handleSubmit} disabled={loading}>
                              Submit
                        </Button>
                  </form>
            </div>
      );
};

export default LoginForm;
