import * as admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

export interface FirebaseAdminAppParams {
        projectId: string;
        clientEmail: string;
        storageBucket: string;
        privateKey: string;
}

const formatFirebasePrivateKey = ( key: string ): string => {
        return key.replace ( /\\n/g, '\n' );
}

const createFirebaseAdminApp = ( params: FirebaseAdminAppParams ): admin.app.App => {
        const privateKey = formatFirebasePrivateKey ( params.privateKey );
        
        // if already created, return the same instance
        if ( admin.apps.length > 0 ) {
                return admin.app ();
        }
       
        // create certificate
        const cert = admin.credential.cert ({
                projectId: params.projectId,
                clientEmail: params.clientEmail,
                privateKey,
        });
       
        // initialize admin app
        return admin.initializeApp ({
                credential: cert,
                projectId: params.projectId,
                storageBucket: params.storageBucket,
        });
}

const getAdmin = (): admin.app.App => {
        const params = {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                privateKey: process.env.FIREBASE_PRIVATE_KEY
        } as FirebaseAdminAppParams;
       
        return createFirebaseAdminApp ( params );
}

const firebase_admin = getAdmin ();
const firestore = firebase_admin.firestore ();
const auth = firebase_admin.auth ();

firestore.settings ({
        ignoreUndefinedProperties: true,
});

export { firestore, auth };