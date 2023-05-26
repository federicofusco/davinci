import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../lib/firebase";
import { getAuth, signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import Cors from "cors";

// Allows only PUT requests from any origin, since external devices need to interact with this endpoint
const cors = Cors ({
        methods: ["POST"],
        origin: "*"
});

interface AuthenticationRequest {
        email: string,
        password: string,
}

interface AuthenticationResponse {
        message: string,
        code: string,
        data?: any
}

async function login ( email: string, password: string, fn: Function, response: NextApiResponse<AuthenticationResponse> ) {
        
        // Attempts to login with the provided credentials
        await signInWithEmailAndPassword ( auth, email, password )
                .then ( async user => {

                        // Generates the user's ID token
                        await getIdToken ( user.user, true )
                                .then ( token => response.status ( 200 ).json ({ message: "Successfully authenticated!", code: "SUCCESS", data: { jwt: token }}) )
                                .catch ( ({ message, code }) => response.status ( 500 ).json ({ message, code }) );
                })
                .catch ( ({ message, code }) => response.status ( 401 ).json ({ message, code }) );
}

export default async function handler ( request: NextApiRequest, response: NextApiResponse<AuthenticationResponse> ) {

        // Gets the user's credentials
        const { email, password }: AuthenticationRequest = request.body;
        if (!email || email.length === 0 || Array.isArray ( email ) || !password || password.length === 0 || Array.isArray ( password ) ) return response.status ( 400 ).json ({ message: "Missing or invalid credentials!", code: "INVALID_CREDENTIALS" });

        await login ( email, password, cors, response );
}