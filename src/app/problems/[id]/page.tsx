import {doc, getDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/firebase";
import {notFound} from 'next/navigation';
import ProblemDescription from "@/components/ProblemDescription/ProblemDescription";

interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

async function getProblem(id: string): Promise<Problem | null> {
    const docRef = doc(db, "problems", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {id: docSnap.id, ...docSnap.data()} as Problem;
    }
    return null;
}

export default async function ProblemPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const problem = await getProblem(id);

    if (!problem) {
        notFound();
    }

    return <div className="bg-gray-100 min-h-screen p-6">
        <ProblemDescription problem={problem}/>
    </div>

}