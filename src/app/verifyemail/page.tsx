"use client"
import React, { useEffect, useState } from 'react'
import { PropagateLoader } from 'react-spinners'
import {Button} from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import ToasterContext from '../../context/ToasterContext';

function VerifyEmailPage() {
      const [verifying, setVerifying]=useState(false);
      const [isVerified, setIsVerified]=useState(false)
      const [token, setToken]=useState("");
      const router=useRouter();
      useEffect( () => {
            const urlToken = window.location.search.split("=")[1];
            setToken(urlToken || "");
        }, [token]);

        async function handleVerifyEmail(){
            setVerifying(true);
            try{
                  await axios.post('/api/verifyemail',{token})
                  .then((res)=>{
                        if(res?.data.status){
                              setVerifying(false)
                              setIsVerified(true)
                        }
                        else {
                              toast.error(res.data.message)
                              setVerifying(false)
                              setIsVerified(false)
                        }
                  })
                  .catch((e)=>{
                        console.log(e.message)
                        toast.error(e.message)
                  }).finally(()=>{
                        setVerifying(false)
                        // setIsVerified(true)
                  })
            } catch(e:any){
                  toast.error("Something went wrong! Please try again")
                  setVerifying(false)
                  setIsVerified(false)
            }
      }
  return (
        
        <div className='h-screen w-screen flex justify-center gap-4 flex-col items-center bg-slate-200'>
          <ToasterContext />
            {!isVerified?(
                  <>
                  <h1 className='text-2xl md:text-4xl  font-semibold'>
                        Verify Email
                   </h1>
                 
                  {verifying? 
                  <PropagateLoader color="#00ff0d" />
                  :
                  <Button  onClick={handleVerifyEmail}>Verify Email</Button>
            }
                  </>

):(
      <>
                  <h1 className='text-2xl md:text-4xl  font-semibold'>
                         Email is Verified
                   </h1>
                  <Button  onClick={()=>router.push('/')}>Go to Login Page</Button>
                  </>
            )}
    </div>
  )
}

export default VerifyEmailPage