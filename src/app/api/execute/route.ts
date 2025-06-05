import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const {code} = await request.json();


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
                stdin: ""
            })
        });

        const submitData = await submitResponse.json();
        const token = submitData.token;


        await new Promise(resolve => setTimeout(resolve, 3000));

        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });

        const result = await resultResponse.json();

        return NextResponse.json({
            output: result.stdout || result.stderr || result.compile_output || 'No output',
            error: result.stderr || result.compile_output,
            status: result.status?.description
        });

    } catch (error) {
        return NextResponse.json({error: 'Execution failed'}, {status: 500});
    }
}