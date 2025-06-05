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
    onChange?: (code: string) => void;
    onRun?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
                                                   defaultCode = '#include <stdio.h>\n\nint main() {\n    printf("Hello World");\n    return 0;\n}',
                                                   onChange,
                                               }) => {
    const [code, setCode] = useState(defaultCode);

    const handleEditorChange = (value: string | undefined) => {
        const newCode = value || '';
        setCode(newCode);
        onChange?.(newCode);
    };

    const handleRun = async () => {

        try {
            const res = await fetch("/api/execute", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({code}),
            })
            const data = await res.json();

            if (res.ok) {
                alert("OUTPUT:\n" + data.output);
                console.log("OUTPUT:\n" + data.output);

            } else {
                alert("Error:\n" + data.error);
            }
        } catch (error) {
            console.error("Error executing code:", error);
        }

    };

    return (
        <div className="h-screen w-screen flex flex-col">


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


            <div className="flex-1">
                <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                    <span className="text-sm font-medium text-gray-700">C</span>
                    <button
                        onClick={handleRun}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                        Run Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
