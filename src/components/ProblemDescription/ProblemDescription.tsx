import React from 'react';

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
    followUp?: string;
}

interface ProblemDescriptionProps {
    problem: Problem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({problem}) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'text-green-500 bg-green-900';
            case 'medium':
                return 'text-yellow-400 bg-yellow-900';
            case 'hard':
                return 'text-red-300 bg-red-900';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-[#1d1d1d] text-white p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl font-bold ">
                        {problem.title}
                    </h1>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(
                            problem.difficulty
                        )}`}
                    >
            {problem.difficulty}
          </span>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <p className=" leading-relaxed whitespace-pre-line">
                    {cleanText(problem.description)}
                </p>
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold  mb-4">Examples</h3>
                    {problem.examples.map((example, index) => (
                        <div key={index} className="mb-6 last:mb-0">
                            <h4 className="font-medium  mb-3">
                                Example {index + 1}:
                            </h4>

                            {/* Input */}
                            <div className="mb-3">
                                <span className="text-sm font-medium">Input:</span>
                                <div className="mt-1 p-3 bg-gray-800 rounded-md border">
                                    <code className="text-sm font-mono text-gwhite">
                                        {example.input}
                                    </code>
                                </div>
                            </div>

                            {/* Output */}
                            <div className="mb-3">
                                <span className="text-sm font-medium ">Output:</span>
                                <div className="mt-1 p-3 bg-gray-800  rounded-md border">
                                    <code className="text-sm font-mono text-white">
                                        {example.output}
                                    </code>
                                </div>
                            </div>

                            {/* Explanation */}
                            {example.explanation && (
                                <div className="mb-3">
                                    <span className="text-sm font-medium ">Explanation:</span>
                                    <p className="mt-1 p-3 bg-gray-800  text-white rounded-md border leading-relaxed">
                                        {example.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Constraints</h3>
                    <ul className="space-y-3">
                        {problem.constraints.map((constraint, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="flex-1 p-3 bg-gray-800  rounded-md border">
                                    <code className="text-sm font-mono text-white">
                                        {cleanText(constraint)}
                                    </code>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};

export default ProblemDescription;

export const cleanText = (text: string) => {
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .trim();
};

