"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const LoginForm = ({ user }: any) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setIsLoading] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    
    // Input values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
          if(email==="" || password==="") return toast.error("Fields cannot be empty")
        setIsLoading(true);
        const toastid = toast.loading("Logging...");
        try {
            const res = await signIn('credentials', { email, password, redirect: false });
            if (res?.error) {
                toast.error('Invalid credentials', { id: toastid });
            }
            if (res?.ok && !res?.error) {
                toast.success('Logged in! Please Refresh!', { id: toastid });
                router.replace('/');
                setTimeout(() => {
                  window.location.reload();
              }, 500);
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setIsLoading(true);
        try {
            if (!resetPassword) {
                const res = await fetch('http://localhost:3000/api/forgotpassword', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });
                if (res.ok) {
                    toast.success("Check Your Email");
                } else {
                    toast.error("Enter Valid Email Address!");
                }
            } else {
                const urlToken = window.location.search.split("=")[1];
                if (!urlToken) {
                    setResetPassword(false);
                }
                if(password!==confirmPassword)
                  return toast.error("Password Doen't Match")
                const token = decodeURIComponent(urlToken);
                const res = await fetch('http://localhost:3000/api/resetpassword', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token, password })
                });
                if (res.ok) {
                    toast.success("Password reset successful");
                    
                    setResetPassword(false);
                    setTimeout(()=>{
                           router.replace('/user/login');
                    },5000)
                } else {
                    toast.error("Something went wrong!");
                }
            }
        } catch (e:any) {
            toast.error(e.message || "An unknown error occurred.");
            console.log(e);
        } finally {
            setEmail("");
            setPassword("");
            setConfirmPassword("")
            setIsLoading(false);
            setResetPassword(false)
        }
    };

    const handleRedirect=()=>{
            setResetPassword(false)
            router.replace('/user/login')
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        if (urlToken?.length > 20) {
            setResetPassword(true);
        } else {
            setResetPassword(false)
        }
    }, [resetPassword, router]);

    return (
        <div className="w-full mx-auto  p-4 h-screen flex flex-col justify-center sm:w-2/3 md:w-3/6 lg:w-2/6">
            <div className="bg-gray-100 p-4 rounded-md max-w-[40rem] min-w-[25rem] shadow-lg ">
            <h2 className="font-bold text-2xl text-center self-center">{!resetPassword ? "Login your Account" : "Reset Your Password"}</h2>
            {!resetPassword ? (
                <form className=" p-4 rounded-lg mt-5 flex flex-col gap-y-5">
                    <div className="w-full flex flex-col gap-2">
                        <label className="font-semibold">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label className="font-semibold">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                            disabled={loading}
                        />
                    </div>
                    <a
                        className="text-right text-sm underline hover:text-green-600 hover:cursor-pointer"
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </a>
                    <Button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "http://localhost:3000/" })}
                        disabled={loading}
                        variant="ghost"
                        className="hover:bg-gray-200 hover:border "
                    >
                        Continue with Google
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                    <div className="flex text-sm text-center gap-1 justify-center">
                        <p>Don't have an Account? </p>
                    <Link href={'/newuser'} className="hover:text-green-500"> Sign Up</Link>
                    </div>
                </form>
            ) : (
                <form className="bg-white p-4 rounded-lg mt-5 flex flex-col gap-y-5">
                    <div className="w-full flex flex-col gap-2">
                        <label className="font-semibold">New Password</label>
                        <input
                            value={password} // Use password instead of email
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                            disabled={loading}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label className="font-semibold">Confirm Password</label>
                        <input
                            value={confirmPassword} // Use confirmPassword instead of email
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="border-2 border-gray-200 outline-none p-2 rounded-md focus:border-gray-300"
                            disabled={loading}
                        />
                    </div>
                    <button
                        className="text-center text-sm underline hover:text-green-600 hover:cursor-pointer"
                        onClick={() => handleRedirect}
                    >
                        Go to Login Page
                    </button>
                    <Button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                </form>
            )}
            </div>
        </div>
    );
};

export default LoginForm;
