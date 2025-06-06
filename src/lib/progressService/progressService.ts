// lib/progressService.ts
import {doc, getDoc, setDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import {db} from '@/lib/firebase/firebase';

export interface UserProgress {
    solved_problems: string[];
    last_updated: Date;
}

export const getUserProgress = async (userId: string): Promise<UserProgress> => {
    try {
        const progressDoc = await getDoc(doc(db, 'user_progress', userId));
        if (progressDoc.exists()) {
            return progressDoc.data() as UserProgress;
        } else {
            // Create initial progress document
            const initialProgress = {solved_problems: [], last_updated: new Date()};
            await setDoc(doc(db, 'user_progress', userId), initialProgress);
            return initialProgress;
        }
    } catch (error) {
        console.error('Error getting user progress:', error);
        return {solved_problems: [], last_updated: new Date()};
    }
};

export const markProblemAsSolved = async (userId: string, problemId: string) => {
    try {
        const progressRef = doc(db, 'user_progress', userId);
        await updateDoc(progressRef, {
            solved_problems: arrayUnion(problemId),
            last_updated: new Date()
        });
    } catch (error) {
        console.error('Error marking problem as solved:', error);
    }
};