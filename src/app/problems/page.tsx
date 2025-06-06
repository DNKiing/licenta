// src/app/problems/page.tsx
'use client';
import {useEffect, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth, db} from '@/lib/firebase/firebase';
import {collection, getDocs} from "firebase/firestore";
import Link from "next/link";
import SolvedBadge from '@/components/SolvedBadge/SolvedBadge';
import {getUserProgress, UserProgress} from '@/lib/progressService/progressService';

interface Problem {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'easy':
            return 'text-green-600 bg-green-100';
        case 'medium':
            return 'text-yellow-600 bg-yellow-100';
        case 'hard':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in to access coding problems and start practicing.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/sign-in"
                            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Practice Problems</h1>
                    <p className="mt-2 text-gray-600">
                        Sharpen your C programming skills • {userProgress.solved_problems.length} solved
                    </p>
                </div>
            </div>

            {/* Problems List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            All Problems ({problems.length})
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {problems.map((problem) => (
                            <Link
                                key={problem.id}
                                href={`/playground/${problem.id}`}
                                className="block hover:bg-gray-50 transition-colors duration-150"
                            >
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <SolvedBadge isSolved={isProblemSolved(problem.id)}/>
                                                <h3 className={`text-lg font-medium hover:text-blue-600 ${
                                                    isProblemSolved(problem.id) ? 'text-green-700' : 'text-gray-900'
                                                }`}>
                                                    {problem.title}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(
                                                        problem.difficulty
                                                    )}`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                {problem.description.split('\n')[0]}
                                            </p>
                                        </div>

                                        <div className="ml-4">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {problems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">No problems available yet</div>
                        <p className="text-gray-500 mt-2">Check back soon for new challenges!</p>
                    </div>
                )}
            </div>
        </div>
    );
}