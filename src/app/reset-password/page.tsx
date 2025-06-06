"use client";
import {useSendPasswordResetEmail} from 'react-firebase-hooks/auth';
import React, {useState} from "react";
import {auth} from "@/lib/firebase/firebase";

type ResetPasswordProps = {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
    const [email, setEmail] = useState('');
    const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);

    const handleResetPassword = async () => {
        if (!email) {
            alert("Please enter your email address");
            return;
        }
        try {
            const res = await sendPasswordResetEmail(email)
            alert("Password reset email sent")
            console.log("Password reset email sent successfully:", res);
        } catch (error) {
            console.error("Error sending password reset email:", error);
            alert("Failed to send password reset email. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Reset Password</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <button
                    onClick={handleResetPassword}
                    className="w-full p-3 bg-indigo-700 rounded text-white hover:bg-indigo-500"
                >
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default ResetPassword;
