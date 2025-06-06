'use client';
import React, {useState} from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-gray-800 text-white">
            Loading editor...
        </div>
    ),
});

interface CodeEditorProps {
    defaultCode?: string;
    testCases?: any[];
    onResults?: (results: any[]) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
                                                   defaultCode = '#include <stdio.h>\n\nint main() {\n    printf("Hello World");\n    return 0;\n}',
                                                   testCases = [],
                                                   onResults
                                               }) => {
    const [code, setCode] = useState(defaultCode);
    const [isRunning, setIsRunning] = useState(false);

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    const handleRun = async () => {
        if (testCases.length === 0) {
            console.log('No test cases provided');
            return;
        }

        setIsRunning(true);

        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    testCases
                }),
            });

            const data = await response.json();
            onResults?.(data.results || []);

        } catch (error) {
            console.error('Error running code:', error);
            onResults?.([]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1d1d1d] ">


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
                    }}
                />
            </div>
            <div className="flex justify-between items-center p-3 bg-[#1d1d1d] border-b">
                <span className="text-sm font-medium text-gray-700">C Editor</span>
                <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isRunning
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </div>
        </div>

    );
};

export default CodeEditor;