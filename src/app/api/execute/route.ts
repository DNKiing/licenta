// src/app/api/execute/route.ts
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {code, testCases} = await request.json();

        const results = [];

        // Run code against each test case
        for (const testCase of testCases) {
            try {
                // Encode code and input as base64
                const encodedCode = Buffer.from(code).toString('base64');
                const encodedInput = Buffer.from(testCase.input).toString('base64');

                // Submit code to Judge0 with base64 encoding
                const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                    body: JSON.stringify({
                        language_id: 50, // C (GCC 9.2.0)
                        source_code: encodedCode,
                        stdin: encodedInput,
                        base64_encoded: true
                    })
                });

                if (!submitResponse.ok) {
                    console.error('Submit error:', submitResponse.status, submitResponse.statusText);
                    results.push({
                        passed: false,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: '',
                        hidden: testCase.hidden,
                        error: `Submit Error: ${submitResponse.status} ${submitResponse.statusText}`,
                        status: 'Error'
                    });
                    continue;
                }

                const submitData = await submitResponse.json();
                const token = submitData.token;

                if (!token) {
                    console.error('No token received from Judge0');
                    results.push({
                        passed: false,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: '',
                        hidden: testCase.hidden,
                        error: 'No token received from Judge0',
                        status: 'Error'
                    });
                    continue;
                }

                // Wait for execution
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Get result with base64 encoding
                const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`, {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    }
                });

                if (!resultResponse.ok) {
                    console.error('Result fetch error:', resultResponse.status, resultResponse.statusText);
                    results.push({
                        passed: false,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: '',
                        hidden: testCase.hidden,
                        error: `Result Fetch Error: ${resultResponse.status} ${resultResponse.statusText}`,
                        status: 'Error'
                    });
                    continue;
                }

                const resultText = await resultResponse.text();
                console.log('Raw Judge0 response:', resultText);

                let result;
                try {
                    result = JSON.parse(resultText);
                } catch (parseError) {
                    console.error('Failed to parse Judge0 response:', parseError);
                    console.error('Response text:', resultText);
                    results.push({
                        passed: false,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: '',
                        hidden: testCase.hidden,
                        error: `Parse Error: Invalid response from Judge0`,
                        status: 'Error'
                    });
                    continue;
                }

                console.log('Parsed Judge0 result:', result);

                // Handle the potential error from Judge0
                if (result.error) {
                    results.push({
                        passed: false,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: '',
                        hidden: testCase.hidden,
                        error: `Judge0 API Error: ${result.error}`,
                        status: 'Error'
                    });
                    continue;
                }

                // Decode base64 outputs safely
                let actualOutput = '';
                let compilationError = '';
                let runtimeError = '';

                try {
                    actualOutput = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8').trim() : '';
                    compilationError = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8').trim() : '';
                    runtimeError = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8').trim() : '';
                } catch (decodeError) {
                    console.error('Base64 decode error:', decodeError);
                    results.push({
                        passed: false,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        actualOutput: '',
                        hidden: testCase.hidden,
                        error: `Decode Error: Failed to decode response`,
                        status: 'Error'
                    });
                    continue;
                }

                const expectedOutput = testCase.expectedOutput.trim();

                // Build comprehensive error message
                let errorMessage = '';

                // Check for compilation errors first
                if (compilationError) {
                    errorMessage = `Compilation Error:\n${compilationError}`;
                }
                // Then runtime errors
                else if (runtimeError) {
                    errorMessage = `Runtime Error:\n${runtimeError}`;
                }
                // Then check status
                else if (result.status && result.status.id && result.status.id !== 3) { // 3 = Accepted
                    switch (result.status.id) {
                        case 6:
                            errorMessage = 'Compilation Error: Failed to compile the program';
                            break;
                        case 5:
                            errorMessage = 'Time Limit Exceeded: Program took too long to execute';
                            break;
                        case 4:
                            errorMessage = 'Wrong Answer';
                            break;
                        case 11:
                            errorMessage = 'Runtime Error: Program crashed during execution';
                            break;
                        case 12:
                            errorMessage = 'Runtime Error: Segmentation fault (memory access violation)';
                            break;
                        case 13:
                            errorMessage = 'Runtime Error: Signal 13 (broken pipe)';
                            break;
                        case 14:
                            errorMessage = 'Runtime Error: Signal 14 (timeout)';
                            break;
                        default:
                            errorMessage = `Execution Error: ${result.status.description || 'Unknown error'}`;
                    }
                }

                results.push({
                    passed: actualOutput === expectedOutput && !errorMessage,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: actualOutput,
                    hidden: testCase.hidden,
                    error: errorMessage,
                    status: result.status?.description || 'Unknown',
                    statusId: result.status?.id
                });

            } catch (error) {
                console.error('Test case execution error:', error);
                const errorMessage = error instanceof Error ? error.message : String(error);

                results.push({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: `Network Error: ${errorMessage}`,
                    status: 'Failed'
                });
            }
        }

        console.log('Final results:', results);
        return NextResponse.json({results});

    } catch (error) {
        console.error('Execution error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({error: `Execution failed: ${errorMessage}`}, {status: 500});
    }
}