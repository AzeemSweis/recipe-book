import { auth as clerkAuth } from "@clerk/nextjs/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin SDK (only once)
if (!getApps().length && process.env.FIREBASE_PROJECT_ID) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("[auth] Firebase Admin initialized for project:", process.env.FIREBASE_PROJECT_ID);
  } catch (e) {
    console.error("[auth] Firebase Admin init failed:", e);
  }
} else if (!process.env.FIREBASE_PROJECT_ID) {
  console.warn("[auth] FIREBASE_PROJECT_ID not set — Firebase auth disabled");
}

export async function getAuthenticatedUserId(req: Request): Promise<string | null> {
  // Try Clerk first (webapp sessions)
  try {
    const { userId } = await clerkAuth();
    if (userId) return userId;
  } catch {
    // Clerk not available (e.g., no session cookie) — fall through to Firebase
  }

  // Try Firebase JWT (iOS app)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const decoded = await getAuth().verifyIdToken(token);
      return decoded.uid;
    } catch (e) {
      console.error("[auth] Firebase token verification failed:", e);
      return null;
    }
  }

  return null;
}
