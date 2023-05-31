import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!getApps().length) {
    initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const adminAuth = admin.auth();

export { adminAuth };