'use client';
import {useState, useEffect} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth} from '@/lib/firebase/firebase';
import {getUserProgress} from '@/lib/progressService/progressService';
import {useRouter} from 'next/navigation';
import Navbar from "@/components/Navbar/Navbar";

interface UserProgress {
    solved_problems: string[];
    last_updated: Date;
}


interface UserProgress {
    solved_problems: string[];
    last_updated: Date;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress>({solved_problems: [], last_updated: new Date()});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const progress = await getUserProgress(user.uid);
                setUserProgress(progress);
            } else {
                router.push('/sign-in');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to sign-in
    }

    const getInitials = (email: string) => {
        return email.split('@')[0].slice(0, 2).toUpperCase();
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div>
            <Navbar/>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 ">


                {/* Profile Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">

                        {/* Profile Header Card */}
                        <div className="bg-gray-900/95 backdrop-blur-lg rounded-lg shadow p-6 ">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getInitials(user.email || '')}
                </span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {user.displayName || user.email?.split('@')[0] || 'User'}
                                    </h2>
                                    <p className="text-gray-300">{user.email}</p>
                                    <p className="text-sm text-gray-300 mt-1">
                                        Member since {formatDate(new Date(user.metadata.creationTime || ''))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gray-900/95 backdrop-blur-lg rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 text-center">Statistics</h3>
                            <div className="flex justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {userProgress.solved_problems.length}
                                    </div>
                                    <div className="text-sm text-gray-300">Problems Solved</div>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-gray-900/95 backdrop-blur-lg rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                            <div className="space-y-4">

                                {/* Email */}
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <div>
                                        <label className="text-sm font-medium text-white">Email Address</label>
                                        <p className="text-gray-300">{user.email}</p>
                                    </div>

                                </div>

                                {/* Display Name */}
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <div>
                                        <label className="text-sm font-medium text-white">Full Name</label>
                                        <p className="text-gray-300">{user.displayName || user.email?.split('@')[0] || 'Not set'}</p>
                                    </div>

                                </div>


                                {/* Account Created */}
                                <div className="flex justify-between items-center py-3">
                                    <div>
                                        <label className="text-sm font-medium text-white">Account Created</label>
                                        <p className="text-gray-300">
                                            {formatDate(new Date(user.metadata.creationTime || ''))}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}