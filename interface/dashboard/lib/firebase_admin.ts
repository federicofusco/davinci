/**
 * The Firebase Admin SDK
 * 
 * This file exports various files:
 * @exports auth - The admin auth handler
 * @exports firestore - The admin firestore handler
 * 
 * Note: While looking through the firebase documentation,
 * 		 remember to always select the Node.JS option in the
 * 		 snippets when using the Admin SDK
 */

export interface FirebaseAdminAppParams {
        projectId: string;
        clientEmail: string;
        storageBucket: string;
        privateKey: string;
}

import { initializeApp, credential, apps, auth as a_auth, firestore as a_firestore } from "firebase-admin";

const config = {
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace ( /\\n/g, '\n' ),
} as FirebaseAdminAppParams;

// Attempts to initialize the admin app
if ( !apps.length ) {
	initializeApp ({
		credential: credential.cert ( config )
	});
}

const auth = a_auth ();
const firestore = a_firestore ();

export {
	auth,
        firestore
};

// import * as admin from "firebase-admin";
// import { Auth } from "firebase-admin/auth";
// import { Firestore } from "firebase-admin/firestore";

// export interface FirebaseAdmin {
//         firebase_admin: admin.app.App,
//         auth: Auth,
//         firestore: Firestore,
// }

// const formatFirebasePrivateKey = ( key: string ): string => {
//         return key.replace ( /\\n/g, '\n' );
// }

// const createFirebaseAdminApp = ( params: FirebaseAdminAppParams ): admin.app.App => {
//         const privateKey = formatFirebasePrivateKey ( params.privateKey );
        
//         // if already created, return the same instance
//         if ( admin.apps.length > 0 ) {
//                 return admin.app ();
//         }
       
//         // create certificate
//         const cert = admin.credential.cert ({
//                 projectId: params.projectId,
//                 clientEmail: params.clientEmail,
//                 privateKey,
//         });
       
//         // initialize admin app
//         return admin.initializeApp ({
//                 credential: cert,
//                 projectId: params.projectId,
//                 storageBucket: params.storageBucket,
//         });
// }

// const initAdmin = (): admin.app.App => {
//         const params = {
                // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                // clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                // privateKey: process.env.FIREBASE_PRIVATE_KEY
//         } as FirebaseAdminAppParams;
       
//         return createFirebaseAdminApp ( params );
// }

// let firebase_admin: admin.app.App | null = null;
// let firestore: Firestore | null = null;
// let auth: Auth | null = null;

// const getAdmin = (): FirebaseAdmin => {
//         if (!firebase_admin) firebase_admin = initAdmin ();

//         if (!firestore) {
//                 firestore = firebase_admin.firestore ();
//                 firestore.settings ({
//                         ignoreUndefinedProperties: true,
//                 });
//         }

//         if (!auth) auth = firebase_admin.auth ();

//         return { firebase_admin, firestore, auth };
// }

// export default getAdmin;