'use client';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {signOut} from 'firebase/auth';
import {auth} from '@/lib/firebase/firebase';
import {onAuthStateChanged, User} from 'firebase/auth';
import Image from "next/image";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const isLoggedIn = !!user;

    const handleLogout = async () => {
        console.log('handleLogout called!');
        try {
            console.log('Attempting to sign out...');
            await signOut(auth);
            console.log('Firebase signOut completed');
            setIsProfileDropdownOpen(false);
            router.push('/');
            console.log('Redirecting to sign-in');
        } catch (error) {
            console.error('Error signing out:', error);
            setIsProfileDropdownOpen(false);
            router.push('/sign-in');
        }
    };

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path);
    };

    return (
        <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center group">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-lg font-bold text-lg group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
                                CodeMaster
                            </div>

                        </Link>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center space-x-1">

                        <Link
                            prefetch={true}
                            href="/problems"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                isActive('/problems') || isActive('/playground')
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            Problems
                        </Link>

                        <Link
                            href="/learn"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                isActive('/learn')
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            Learn
                        </Link>
                    </div>

                    {/* Auth Buttons / User Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="relative">
                                <div
                                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 p-0.5"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    <Image
                                        src="/profile.jpg"
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                </div>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-3 w-52 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl py-2 z-50 border border-gray-700/50">
                                        <div className="px-4 py-3 border-b border-gray-700/50">
                                            <div className="font-medium text-white text-sm">Profile Menu</div>
                                            <div className="text-gray-400 text-xs mt-0.5">{user?.email}</div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            View Profile
                                        </Link>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleLogout();
                                            }}
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-300"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div
                            className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/50 backdrop-blur-lg rounded-lg mt-2 border border-gray-700/50">
                            <Link
                                href="/"
                                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                                    pathname === '/'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>

                            <Link
                                href="/problems"
                                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                                    isActive('/problems') || isActive('/playground')
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Problems
                            </Link>

                            <Link
                                href="/learn"
                                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                                    isActive('/learn')
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Learn
                            </Link>

                            <div className="border-t border-gray-700/50 pt-3 mt-3">
                                {isLoggedIn ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center px-3 py-2">
                                            <div
                                                className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                                                <Image
                                                    src="/profile.jpg"
                                                    alt="Profile"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-white font-medium">Profile</span>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            View Profile
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-300"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/sign-in"
                                            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            className="block px-3 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 mt-2 transition-all duration-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;