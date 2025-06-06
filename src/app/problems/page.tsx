// src/app/problems/page.tsx
'use client';
import {useEffect, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth, db} from '@/lib/firebase/firebase';
import {collection, getDocs} from "firebase/firestore";
import Link from "next/link";
import SolvedBadge from '@/components/SolvedBadge/SolvedBadge';
import {getUserProgress, UserProgress} from '@/lib/progressService/progressService';
import {cleanText} from "@/components/ProblemDescription/ProblemDescription";
import Navbar from "@/components/Navbar/Navbar";
import PageTransition from "@/components/PageTransition/PageTransition";

interface Problem {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'easy':
            return 'text-green-400 bg-green-900/30 border-green-500/30';
        case 'medium':
            return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
        case 'hard':
            return 'text-red-400 bg-red-900/30 border-red-500/30';
        default:
            return 'text-gray-400 bg-gray-800/30 border-gray-500/30';
    }
};

export default function ProblemsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [userProgress, setUserProgress] = useState<UserProgress>({solved_problems: [], last_updated: new Date()});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const progress = await getUserProgress(user.uid);
                setUserProgress(progress);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchProblems();
        }
    }, [user]);

    const fetchProblems = async () => {
        try {
            const problemsCollection = collection(db, 'problems');
            const problemsSnapshot = await getDocs(problemsCollection);
            const problemsData = problemsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Problem[];
            setProblems(problemsData);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };

    const isProblemSolved = (problemId: string) => {
        return userProgress.solved_problems.includes(problemId);
    };

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
                    <p className="mt-4 text-white text-lg">Loading problems...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                <div
                    className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
                    <div className="mb-6">
                        <div
                            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                        <p className="text-gray-300">
                            Sign in to access coding problems and start your programming journey.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <Link
                            href="/sign-in"
                            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="block w-full border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-700/30"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                <Navbar/>

                {/* Header Section */}
                <div className="pt-8 pb-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Coding <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Challenges</span>
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Solve problems, improve your skills • {userProgress.solved_problems.length} completed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div
                        className="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
                        <div className="px-6 py-6 border-b border-gray-700/50 bg-gray-800/60">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                                    All Problems ({problems.length})
                                </h2>
                                <div className="text-sm text-gray-400">
                                    {userProgress.solved_problems.length}/{problems.length} solved
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-700/50">
                            {problems.map((problem, index) => (
                                <Link
                                    key={problem.id}
                                    href={`/playground/${problem.id}`}
                                    className="block hover:bg-gray-700/30 transition-all duration-300 group"
                                >
                                    <div className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-gray-500 font-mono text-sm w-8">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </div>
                                                        <SolvedBadge isSolved={isProblemSolved(problem.id)}/>
                                                    </div>

                                                    <h3 className={`text-lg font-semibold group-hover:text-blue-400 transition-colors ${
                                                        isProblemSolved(problem.id) ? 'text-green-400' : 'text-white'
                                                    }`}>
                                                        {problem.title}
                                                    </h3>

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getDifficultyColor(problem.difficulty)}`}>
                                                        {problem.difficulty}
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 ml-11">
                                                    {cleanText(problem.description).split('\n')[0]}
                                                </p>
                                            </div>

                                            <div className="ml-6 flex items-center space-x-4">
                                                {isProblemSolved(problem.id) && (
                                                    <div className="text-green-400 text-sm font-medium">
                                                        ✓ Solved
                                                    </div>
                                                )}
                                                <div
                                                    className="text-gray-400 group-hover:text-blue-400 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M9 5l7 7-7 7"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {problems.length === 0 && (
                        <div className="text-center py-16">
                            <div
                                className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Problems Available</h3>
                            <p className="text-gray-400">Check back soon for new coding challenges!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}