import React from "react";

interface TestResult {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    hidden: boolean;
    error?: string;
}

interface TestResultsProps {
    results: TestResult[];
    loading: boolean;
}

const TestResults: React.FC<TestResultsProps> = ({results, loading}) => {
    if (loading) {
        return (
            <div className="p-4">
                <div className="text-center">Running test cases...</div>
            </div>
        );
    }

    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;

    return (
        <div className="p-4 h-full overflow-y-auto bg-[#1d1d1d]">
            <div className="flex justify-between items-center mb-4 ">
                <h3 className="font-semibold">Test Results</h3>
                <span
                    className={`px-2 py-1 rounded text-sm ${passedCount === totalCount ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {passedCount}/{totalCount} Passed
        </span>
            </div>

            {results.map((result, index) => (
                <div key={index}
                     className={`p-3 mb-3 rounded border-l-4 ${result.passed ? 'bg-[#3d3d3d] border-green-400' : 'bg-[#1d1d1d] border-red-400'}`}>
                    <div className="flex items-center gap-2 mb-2">
            <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
              {result.passed ? '✅' : '❌'}
            </span>
                        <span className="font-medium">
              {result.hidden ? `Hidden Test Case ${index + 1}` : `Test Case ${index + 1}`}
            </span>
                    </div>

                    {!result.hidden && (
                        <div className="space-y-2 text-sm text-white">
                            <div>
                                <span className="font-medium">Input:</span>
                                <pre className="bg-[#1d1d1d] p-2 rounded mt-1 text-xs">{result.input}</pre>
                            </div>
                            <div>
                                <span className="font-medium ">Expected:</span>
                                <pre className="bg-[#1d1d1d] p-2 rounded mt-1 text-xs">{result.expectedOutput}</pre>
                            </div>
                            <div>
                                <span className="font-medium ">Got:</span>
                                <pre
                                    className={`p-2 rounded mt-1 text-white text-xs ${result.passed ? 'bg-green-700' : 'bg-[#1d1d1d]'}`}>
                  {result.actualOutput}
                </pre>
                            </div>
                        </div>
                    )}

                    {result.error && (
                        <div className="mt-2">
                            <span className="font-medium text-white">Error:</span>
                            <pre className="bg-[#1e1e1e] p-2 rounded mt-1 text-xs text-white">{result.error}</pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TestResults;