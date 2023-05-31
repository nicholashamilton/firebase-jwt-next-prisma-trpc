import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function isFirebaseError(error: unknown): error is { code: string } {
    return (typeof error === 'object' && error !== null && 'code' in error);
}

const firebaseErrorRecord: Record<string, string> = {
    'auth/user-not-found': 'No user associated with email',
    'auth/wrong-password': 'Provided password is not valid',
};

export {
    app,
    auth,
    isFirebaseError,
    firebaseErrorRecord,
};