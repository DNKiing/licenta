import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {code, testCases} = await request.json();

        const results = [];

        // Run code against each test case
        for (const testCase of testCases) {
            try {
                // Submit code to Judge0
                const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                    body: JSON.stringify({
                        language_id: 50, // C (GCC 9.2.0)
                        source_code: code,
                        stdin: testCase.input
                    })
                });

                const submitData = await submitResponse.json();
                const token = submitData.token;

                // Wait for execution
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Get result
                const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    }
                });

                const result = await resultResponse.json();
                const actualOutput = (result.stdout || '').trim();
                const expectedOutput = testCase.expectedOutput.trim();

                results.push({
                    passed: actualOutput === expectedOutput,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: actualOutput,
                    hidden: testCase.hidden,
                    error: result.stderr
                });

            } catch (error) {
                results.push({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: 'Execution Error',
                    hidden: testCase.hidden,
                    error: 'Failed to execute'
                });
            }
        }

        return NextResponse.json({results});

    } catch (error) {
        console.error('Execution error:', error);
        return NextResponse.json({error: 'Execution failed'}, {status: 500});
    }
}