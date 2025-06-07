"use client";


import {auth} from "@/lib/firebase/firebase";
import {signInWithEmailAndPassword} from "firebase/auth";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

type SignInProps = {};

const SignIn: React.FC<SignInProps> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

            const user = userCredential.user;
            setEmail("")
            setPassword("")
            router.push("/problems");
            console.log("User signed in:", user);
        }).catch((error) => {
            alert("Invalid email or password");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", errorCode, errorMessage);
        })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-[#1e1e1e] rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 bg-[#1e1e1e] rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSignIn}
                    className="w-full p-3 bg-purple-700 rounded text-white hover:bg-indigo-500"
                >
                    Sign In
                </button>
                <p className="text-white mt-4"> Forgot your password? <button
                    className="text-blue-300 hover:text-blue-400"><Link href="/reset-password">Reset
                    Password</Link></button></p>
            </div>
        </div>
    );
}

export default SignIn;