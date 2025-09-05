import * as admin from "firebase-admin";

let adminApp;
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
} else {
  adminApp = admin.app();
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
