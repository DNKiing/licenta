// src/app/learn/page.tsx
'use client';
import {useState} from 'react';
import PageTransition from '@/components/PageTransition/PageTransition';
import Navbar from "@/components/Navbar/Navbar";
import {Topic} from "@/app/learn/Topic";
import topics from "@/app/learn/Topic";

export default function LearnPage() {
    const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);

    const highlightSyntax = (code: string) => {
        return code;
    };

    return (
        <PageTransition>
            <div>
                <Navbar/>

                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">

                    {/* Header Section */}
                    <div className="pt-8 pb-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    Learn <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">C Programming</span>
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Master the fundamentals of C programming with interactive examples
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="grid lg:grid-cols-4 gap-8">

                            {/* Sidebar - Topic List */}
                            <div className="lg:col-span-1">
                                <div
                                    className="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-white mb-4">Topics</h2>
                                    <nav className="space-y-2">
                                        {topics.map((topic) => (
                                            <button
                                                key={topic.id}
                                                onClick={() => setSelectedTopic(topic)}
                                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                                                    selectedTopic.id === topic.id
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                                }`}
                                            >
                                                {topic.title}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                <div
                                    className="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">

                                    {/* Topic Header */}
                                    <div className="px-8 py-6 border-b border-gray-700/50 bg-gray-800/60">
                                        <h1 className="text-3xl font-bold text-white mb-2">{selectedTopic.title}</h1>

                                    </div>

                                    <div className="p-8 space-y-8">

                                        {/* Definition Section */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                Definition
                                            </h2>
                                            <p className="text-gray-300 leading-relaxed text-lg bg-gray-900/30 p-6 rounded-xl border border-gray-700/30">
                                                {selectedTopic.definition}
                                            </p>
                                        </div>

                                        {/* Code Examples Section */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                                </svg>
                                                Code Examples
                                            </h2>

                                            <div className="space-y-6">
                                                {selectedTopic.codeExamples.map((example, index) => (
                                                    <div key={index}
                                                         className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">

                                                        {/* Example Header */}
                                                        <div
                                                            className="px-6 py-4 bg-gray-800/70 border-b border-gray-700/50">
                                                            <h3 className="font-semibold text-white">{example.title}</h3>
                                                        </div>

                                                        {/* Code Block */}
                                                        <div className="p-6">
                                                            <div
                                                                className="bg-gray-900 rounded-lg p-6 mb-4 border border-gray-700/30">
                              <pre className="text-sm overflow-x-auto">
                                <code
                                    className="text-gray-200 font-mono leading-relaxed"
                                    dangerouslySetInnerHTML={{__html: highlightSyntax(example.code)}}
                                />
                              </pre>
                                                            </div>

                                                            {/* Explanation */}
                                                            <div
                                                                className="bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                                                <p className="text-gray-300 leading-relaxed">
                                                                <span
                                                                    className="text-blue-400 font-medium">Explanation: </span>
                                                                    {example.explanation}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Key Points Section */}
                                        <div>
                                            <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                Key Points
                                            </h2>
                                            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/30">
                                                <ul className="space-y-3">
                                                    {selectedTopic.keyPoints.map((point, index) => (
                                                        <li key={index} className="flex items-start text-gray-300">
                                                            <div
                                                                className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                            <span className="leading-relaxed">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Practice Suggestion */}
                                        <div
                                            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                                            <div className="flex items-center mb-3">
                                                <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                                </svg>
                                                <h3 className="text-lg font-semibold text-white">Ready to Practice?</h3>
                                            </div>
                                            <p className="text-gray-300 mb-4">
                                                Now that you've learned about {selectedTopic.title.toLowerCase()}, try
                                                solving some coding problems to reinforce your understanding!
                                            </p>
                                            <a
                                                href="/problems"
                                                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                            >
                                                Practice Problems
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}