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

export default Problem;