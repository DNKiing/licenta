// src/app/playground/[id]/page.tsx
import {doc, getDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/firebase";
import {notFound} from 'next/navigation';
import PlaygroundClient from '../PlaygroundClient';
import Problem from "@/utils/Problem";

async function getProblem(id: string): Promise<Problem | null> {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {id: docSnap.id, ...docSnap.data()} as Problem;
    }
    return null;
}

export default async function PlaygroundPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const problem = await getProblem(id);

    if (!problem) {
        notFound();
    }

    return <PlaygroundClient problem={problem}/>;
}