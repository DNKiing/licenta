// src/app/playground/[id]/PlaygroundClient.tsx
'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
import ProblemDescription from '@/components/ProblemDescription/ProblemDescription';
import TestResults from '@/components/TestResults/TestResults';

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
        .replace(/\\n/g, '\n')  // Convert \n to actual newlines
        .replace(/\\t/g, '\t')  // Convert \t to actual tabs
        .trim();                // Remove extra whitespace
};

const defaultCode = `#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}`;

export default function PlaygroundClient({problem}: PlaygroundClientProps) {
    const [code, setCode] = useState(
        problem.template ? cleanTemplate(problem.template) : defaultCode
    );
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'results' | 'output'>('output');

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
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

        } catch (error) {
            console.error('Error running code:', error);
            setResults([]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Left Side - Problem Description */}
            <div className="w-1/2 bg-white border-r">
                <ProblemDescription problem={problem}/>
            </div>

            {/* Right Side - Code Editor and Output */}
            <div className="w-1/2 flex flex-col">
                {/* Top Right - Code Editor */}
                <div className="h-1/2 border-b">
                    <div className="flex flex-col h-full">
                        {/* Editor Header */}
                        <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">C Editor</span>
                                <span className="text-xs text-gray-500">({problem.title})</span>
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

                        {/* Editor */}
                        <div className="flex-1 min-h-0">
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
                <div className="h-1/2 flex flex-col bg-white">
                    {/* Tab Headers */}
                    <div className="flex border-b bg-gray-50">
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'output'
                                    ? 'border-blue-500 text-blue-600 bg-white'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Console Output
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'results'
                                    ? 'border-blue-500 text-blue-600 bg-white'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Test Results
                            {results.length > 0 && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
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
                            <div className="h-full p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto">
                                <div className="mb-2 text-gray-300">Console Output:</div>
                                {results.length > 0 ? (
                                    <div className="space-y-2">
                                        {results.map((result: any, index: number) => (
                                            <div key={index} className="border-b border-gray-700 pb-2">
                                                <div className="text-yellow-400">Test Case {index + 1}:</div>
                                                <div className="ml-2">
                                                    <div
                                                        className="text-gray-300">Output: {result.actualOutput || 'No output'}</div>
                                                    {result.error &&
                                                        <div className="text-red-400">Error: {result.error}</div>}
                                                </div>
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