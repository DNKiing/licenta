'use client';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {signOut} from 'firebase/auth';
import {auth} from '@/lib/firebase/firebase';
import {onAuthStateChanged, User} from 'firebase/auth';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state changes
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
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-md font-bold text-lg">
                                C++
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-900">CodeMaster</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                pathname === '/'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/problems"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/problems') || isActive('/playground')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Problems
                        </Link>

                        <Link
                            href="/learn"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/learn')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Learn
                        </Link>

                        <Link
                            href="/quiz"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/quiz')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Quiz
                        </Link>
                    </div>

                    {/* Auth Buttons / User Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="relative">
                                <div
                                    className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    P
                                </div>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                            <div className="font-medium">Profile Menu</div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                alert('Sign Out button clicked!'); // Debug log
                                                handleLogout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
                            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
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
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-md">
                            <Link
                                href="/"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    pathname === '/'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>

                            <Link
                                href="/problems"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive('/problems') || isActive('/playground')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Problems
                            </Link>

                            <Link
                                href="/learn"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive('/learn')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Learn
                            </Link>

                            <Link
                                href="/quiz"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive('/quiz')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Quiz
                            </Link>

                            <div className="border-t border-gray-200 pt-3 mt-3">
                                {isLoggedIn ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center px-3 py-2">
                                            <div
                                                className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm mr-3">
                                                P
                                            </div>
                                            <span className="text-gray-900 font-medium">Profile</span>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('Mobile Sign Out button clicked!'); // Debug log
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/sign-in"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 mt-2"
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