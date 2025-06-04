"use client";


import {auth} from "@/app/firebase/firebase";
import {signInWithEmailAndPassword} from "firebase/auth";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

type SignInProps = {};

const SignIn: React.FC<SignInProps> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setEmail("")
            setPassword("")
            router.push("/");
            console.log("User signed in:", user);
        }).catch((error) => {
            alert("Invalid email or password");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error signing in:", errorCode, errorMessage);
        })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSignIn}
                    className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
}

export default SignIn;