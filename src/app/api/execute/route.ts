import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {code, testCases} = await request.json();

        if (!process.env.RAPIDAPI_KEY) {
            console.error('RAPIDAPI_KEY is not set in environment variables');
            return NextResponse.json({error: 'API key not configured'}, {status: 500});
        }

        // Combinam toate test cases într-un singur input
        const combinedInput = testCases.map((testCase: any) => testCase.input).join('\n');

        console.log('Combined input:', combinedInput);

        const encodedCode = Buffer.from(code).toString('base64');
        const encodedInput = Buffer.from(combinedInput).toString('base64');

        console.log('Submitting to Judge0...');

        const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false', {
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
            const errorText = await submitResponse.text();
            console.error('Submit error:', submitResponse.status, submitResponse.statusText, errorText);
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: `Submit Error: ${submitResponse.status} ${submitResponse.statusText}`,
                    status: 'Error'
                }))
            });
        }

        const submitData = await submitResponse.json();
        const token = submitData.token;

        if (!token) {
            console.error('No token received from Judge0');
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: 'No token received from Judge0',
                    status: 'Error'
                }))
            });
        }


        let result = null;
        let attempts = 0;
        const maxAttempts = 15;

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;

            console.log(`Polling attempt ${attempts}/${maxAttempts}`);

            const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`, {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            });

            if (!resultResponse.ok) {
                console.error('Result fetch error:', resultResponse.status, resultResponse.statusText);
                continue;
            }

            const resultText = await resultResponse.text();
            console.log('Raw Judge0 response:', resultText);

            try {
                result = JSON.parse(resultText);
            } catch (parseError) {
                console.error('Failed to parse Judge0 response:', parseError);
                continue;
            }


            if (result.status && result.status.id && result.status.id > 2) {
                console.log('Execution completed with status:', result.status);
                break;
            }

            console.log('Still processing, status:', result.status);
        }

        if (!result || !result.status || result.status.id <= 2) {
            console.error('Execution timed out or incomplete');
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: 'Execution timeout - Judge0 took too long to process',
                    status: 'Timeout'
                }))
            });
        }

        //Procesam răspunsul de la Judge0
        let fullOutput = '';
        let compilationError = '';
        let runtimeError = '';

        try {
            fullOutput = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8').trim() : '';
            compilationError = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8').trim() : '';
            runtimeError = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8').trim() : '';
        } catch (decodeError) {
            console.error('Base64 decode error:', decodeError);
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: 'Decode Error: Failed to decode response',
                    status: 'Error'
                }))
            });
        }

        // Verificam dacă există erori de compilare sau execuție
        if (compilationError) {
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: `Compilation Error:\n${compilationError}`,
                    status: 'Compilation Error'
                }))
            });
        }

        if (runtimeError) {
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: `Runtime Error:\n${runtimeError}`,
                    status: 'Runtime Error'
                }))
            });
        }

        if (result.status && result.status.id !== 3) { // 3 = Accepted
            const errorMessage = `Execution Error: ${result.status.description || 'Unknown error'}`;
            return NextResponse.json({
                results: testCases.map((testCase: any) => ({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: '',
                    hidden: testCase.hidden,
                    error: errorMessage,
                    status: result.status.description || 'Error'
                }))
            });
        }

        //Split la output pentru a valioda fiecare test case
        const outputLines = fullOutput.split('\n').filter(line => line.trim() !== '');

        console.log('Output lines:', outputLines);
        console.log('Expected outputs:', testCases.map((tc: any) => tc.expectedOutput));

        // Creem resultate pentru fiecare test case
        const results = testCases.map((testCase: any, index: number) => {
            const actualOutput = outputLines[index] || '';
            const expectedOutput = testCase.expectedOutput.trim();

            return {
                passed: actualOutput === expectedOutput,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: actualOutput,
                hidden: testCase.hidden,
                error: '',
                status: 'Completed',
                statusId: result.status?.id
            };
        });

        console.log('Final results:', results);
        return NextResponse.json({results});

    } catch (error) {
        console.error('Execution error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({error: `Execution failed: ${errorMessage}`}, {status: 500});
    }
}