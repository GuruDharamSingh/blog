// Client-side Firebase initialization (analytics, auth, etc.)
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

function hasFirebaseEnv() {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!hasFirebaseEnv()) return null;
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  try {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (e) {
    console.warn('[firebase] Failed to init client app:', e);
    return null;
  }
}

export async function initAnalytics() {
  try {
    const app = getFirebaseApp();
    if (!app) return null;
    if (typeof window !== 'undefined' && (await isSupported())) {
      return getAnalytics(app);
    }
  } catch (e) {
    console.warn('Analytics not supported', e);
  }
  return null;
}
