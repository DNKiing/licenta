// src/app/page.tsx
'use client';
import Link from 'next/link';
import {useState, useEffect} from 'react';

export default function LandingPage() {
    const [currentCode, setCurrentCode] = useState(0);

    const codeExamples = [
        '#include <stdio.h>\nint main() {\n    printf("Hello World");\n    return 0;\n}',
        'int fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}',
        'void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1])\n                swap(&arr[j], &arr[j+1]);\n}'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCode((prev) => (prev + 1) % codeExamples.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column - Text Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                Master
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {" "}C Programming
                </span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Practice coding problems, test your skills with real compiler feedback,
                                and track your progress. From basics to advanced algorithms.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/problems"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center"
                            >
                                Start Coding
                            </Link>
                            <Link
                                href="/learn"
                                className="border-2 border-gray-400 hover:border-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-gray-900 text-center"
                            >
                                Learn Basics
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">50+</div>
                                <div className="text-gray-400">Problems</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-400">∞</div>
                                <div className="text-gray-400">Practice</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">100%</div>
                                <div className="text-gray-400">Free</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Code Editor Mockup */}
                    <div className="relative">
                        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">

                            {/* Editor Header */}
                            <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="text-gray-400 text-sm">main.c</div>
                                <div className="text-green-400 text-sm">● Live</div>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 font-mono text-sm leading-relaxed h-64 overflow-hidden">
                                <div className="space-y-1">
                                    {codeExamples[currentCode].split('\n').map((line, index) => (
                                        <div key={index} className="flex">
                      <span className="text-gray-500 w-8 text-right mr-4 select-none">
                        {index + 1}
                      </span>
                                            <span className="text-gray-200">
                        {line.split(' ').map((word, wordIndex) => {
                            if (['#include', 'int', 'void', 'return', 'if', 'for'].includes(word)) {
                                return <span key={wordIndex} className="text-purple-400">{word} </span>;
                            }
                            if (['printf', 'scanf', 'main', 'fibonacci', 'bubbleSort'].includes(word.replace(/[()]/g, ''))) {
                                return <span key={wordIndex} className="text-blue-400">{word} </span>;
                            }
                            if (word.includes('"')) {
                                return <span key={wordIndex} className="text-green-400">{word} </span>;
                            }
                            return <span key={wordIndex}>{word} </span>;
                        })}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Output Section */}
                            <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
                                <div className="text-green-400 text-sm">
                                    <span className="text-gray-500">$</span> gcc main.c && ./a.out
                                </div>
                                <div className="text-green-300 mt-1">
                                    {currentCode === 0 && "Hello World"}
                                    {currentCode === 1 && "fibonacci(5) = 5"}
                                    {currentCode === 2 && "Array sorted successfully"}
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div
                            className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                            Real Compiler
                        </div>
                        <div
                            className="absolute -bottom-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                            Instant Feedback
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-black bg-opacity-30 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why Choose <span className="text-blue-400">CodeMaster</span>?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Feature 1 */}
                        <div className="text-center group">
                            <div
                                className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Real Compiler</h3>
                            <p className="text-gray-400">
                                Practice with actual GCC compiler. Get real error messages and debugging experience.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center group">
                            <div
                                className="bg-gradient-to-br from-green-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Instant Testing</h3>
                            <p className="text-gray-400">
                                Automatic test case validation. Know immediately if your solution is correct.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center group">
                            <div
                                className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                            <p className="text-gray-400">
                                Monitor your coding journey. See which problems you've solved and improve over time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Code</span>?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of developers improving their C programming skills. Start your coding journey
                        today.
                    </p>
                    <Link
                        href="/sign-up"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-12 py-4 rounded-lg font-semibold text-xl transition-all duration-300 transform hover:scale-105 inline-block"
                    >
                        Get Started Free
                    </Link>
                </div>
            </div>
        </div>
    );
}