'use client';
import {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth} from '@/lib/firebase/firebase';
import ProblemDescription from '@/components/ProblemDescription/ProblemDescription';
import TestResults from '@/components/TestResults/TestResults';
import {markProblemAsSolved, getUserProgress} from '@/lib/progressService/progressService';
import SolvedBadge from '@/components/SolvedBadge/SolvedBadge';

const Editor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-gray-800 text-white">
            Loading editor...
        </div>
    ),
});

interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    examples?: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    constraints?: string[];
    template?: string;
    testCases?: Array<{
        input: string;
        expectedOutput: string;
        hidden: boolean;
    }>;
}

interface PlaygroundClientProps {
    problem: Problem;
}

const cleanTemplate = (template: string) => {
    return template
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .trim();
};

const defaultCode = `#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}`;

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

export default function PlaygroundClient({problem}: PlaygroundClientProps) {
    const [code, setCode] = useState(() => {
        const savedCode = loadCodeFromStorage(problem.id);
        if (savedCode) {
            return savedCode;
        }
        return problem.template ? cleanTemplate(problem.template) : defaultCode;
    });
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'results' | 'output'>('output');
    const [user, setUser] = useState<User | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [showSolvedMessage, setShowSolvedMessage] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveCodeToStorage(problem.id, code);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [code, problem.id]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {

                const progress = await getUserProgress(user.uid);
                setIsSolved(progress.solved_problems.includes(problem.id));
            }
        });

        return () => unsubscribe();
    }, [problem.id]);

    const handleEditorChange = (value: string | undefined) => {
        const newCode = value || '';
        setCode(newCode);
    };


    const handleRun = async () => {
        if (!problem.testCases || problem.testCases.length === 0) {
            console.log('No test cases available');
            return;
        }

        setIsRunning(true);
        setActiveTab('output');

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    testCases: problem.testCases
                }),
            });

            const data = await response.json();
            setResults(data.results || []);


            const allPassed = data.results?.every((result: any) => result.passed);

            if (allPassed && user && !isSolved) {
                // Mark problem as solved for the first time
                await markProblemAsSolved(user.uid, problem.id);
                setIsSolved(true);
                setShowSolvedMessage(true);

                setTimeout(() => setShowSolvedMessage(false), 3000);
            }

        } catch (error) {
            console.error('Error running code:', error);
            setResults([]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-screen flex bg-[#1d1d1d] text-white">
            {/* Left Side - Problem Description */}
            <div className="w-1/2 bg-[#1d1d1d] border-r">
                <ProblemDescription problem={problem}/>
            </div>

            {/* Right Side - Code Editor and Output */}
            <div className="w-2/3 flex flex-col bg-[#1d1d1d]">

                {/* Top Right - Code Editor */}
                <div className="h-2/3 border-b">
                    <div className="flex flex-col h-full">

                        {/* Editor Header */}
                        <div className="flex justify-between items-center p-3 bg-[#1d1d1d]">
                            <div className="flex items-center gap-3">

                                <div className="flex items-center gap-2">
                                    <SolvedBadge isSolved={isSolved} size="sm"/>
                                    <span
                                        className={`text-xs font-medium ${isSolved ? 'text-green-700' : 'text-gray-500'}`}>
                                        {problem.title}
                                    </span>

                                </div>
                            </div>
                            <button
                                onClick={handleRun}
                                disabled={isRunning || !problem.testCases || problem.testCases.length === 0}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isRunning || !problem.testCases || problem.testCases.length === 0
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                {isRunning ? 'Running...' : 'Run Code'}
                            </button>
                        </div>


                        {/* Solved Success Message */}
                        {showSolvedMessage && (
                            <div className="bg-green-50 border-l-4 border-green-400 p-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Congratulations! Problem solved successfully!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Editor */}
                        <div className="flex-1 min-h-0 bg-[#1d1d1d]">
                            <Editor
                                height="100%"
                                defaultLanguage="c"
                                theme="vs-dark"
                                value={code}
                                onChange={handleEditorChange}
                                options={{
                                    minimap: {enabled: false},
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    renderWhitespace: 'selection',
                                    tabSize: 4,
                                    insertSpaces: true,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Right - Output/Results */}
                <div className="h-1/3 flex flex-col bg-[#1d1d1d] text-white">

                    {/* Tab Headers */}
                    <div className="flex bg-[#1d1d1d]">
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'output'
                                    ? 'border-blue-500 text-blue-600 bg-[#1d1d1d]'
                                    : 'border-transparent text-white hover:text-blue-300'
                            }`}
                        >
                            Console Output
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'results'
                                    ? 'border-blue-500 text-blue-600 bg-[#1d1d1d]'
                                    : 'border-transparent text-white     hover:text-blue-300'
                            }`}
                        >
                            Test Results
                            {results.length > 0 && (
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                    results.filter((r: any) => r.passed).length === results.length
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {results.filter((r: any) => r.passed).length}/{results.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'results' ? (
                            <TestResults results={results} loading={isRunning}/>
                        ) : (
                            <div className="h-full p-4 bg-[#1d1d1d] text-green-400 font-mono text-sm overflow-y-auto">

                                {results.length > 0 ? (
                                    <div className="space-y-3">
                                        {results.map((result: any, index: number) => (
                                            <div key={index} className="border-b border-gray-700 pb-2 last:border-b-0">


                                                {result.error ? (
                                                    <div
                                                        className="text-red-400 whitespace-pre-wrap font-mono bg-red-900/20 p-3 rounded border-l-4 border-red-500">
                                                        {result.error}
                                                    </div>
                                                ) : result.actualOutput ? (
                                                    <div
                                                        className="bg-gray-800/50 p-3 rounded border-l-4 border-green-500">
                                                        <div className="text-gray-400 text-xs mb-1">OUTPUT:</div>
                                                        <div className="text-green-400">{result.actualOutput}</div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="text-gray-500 bg-gray-800/50 p-3 rounded border-l-4 border-gray-500">
                                                        No output produced
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500">Run your code to see output...</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


const getStorageKey = (problemId: string) => `code_${problemId}`;

const saveCodeToStorage = (problemId: string, code: string) => {
    try {
        localStorage.setItem(getStorageKey(problemId), code);
    } catch (error) {
        console.error('Failed to save code to localStorage:', error);
    }
};

const loadCodeFromStorage = (problemId: string): string | null => {
    try {
        return localStorage.getItem(getStorageKey(problemId));
    } catch (error) {
        console.error('Failed to load code from localStorage:', error);
        return null;
    }
};