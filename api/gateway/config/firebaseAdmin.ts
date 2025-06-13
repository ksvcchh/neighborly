import * as admin from "firebase-admin";

admin.initializeApp();

export const firebaseAuth = admin.auth();
export default admin;
