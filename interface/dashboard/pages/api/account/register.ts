import type { NextApiRequest, NextApiResponse } from "next";
import { auth, firestore } from "../../../lib/firebase";
import { doc, setDoc, GeoPoint } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import NextCors from 'nextjs-cors';

interface RegistrationRequest {
        email: string,
        password: string,
}

interface RegistrationResponse {
        message: string,
        code: string,
        data?: any
}

async function register ( email: string, password: string, response: NextApiResponse<RegistrationResponse> ) {

        // Attempts to create the new user
        createUserWithEmailAndPassword ( auth, email, password )
                .then ( async ({ user }) => {

                        // Registers the device
                        const device_ref = doc ( firestore, "devices", user.uid );
                        await setDoc ( device_ref, {
                                owner: user.email,
                                location: new GeoPoint ( 0, 0 ),
                        })
                        .then ( () => response.status ( 200 ).json ({ message: "Registered successfully!", code: "SUCCESS", data: user }) )
                        .catch ( ({ message, code }) => {
                                
                                // Failed to register device, deletes the user's account
                                deleteUser ( user )
                                        .then ( () => response.status ( 500 ).json ({ message: message, code: code }) )
                                        .catch ( _ => response.status ( 500 ).json ({ message: message, code: code }) );
                        });
                })
                .catch ( ({ message, code }) => response.status ( 401 ).json ({ message, code }) );
}

export default async function handler ( request: NextApiRequest, response: NextApiResponse<RegistrationResponse> ) {

        await NextCors(request, response, {
                methods: ['GET', 'PUT', 'POST'],
                origin: '*',
                optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });
          

        // Gets the user's credentials
        const { email, password }: RegistrationRequest = request.body;
        if (
                !email || email.length === 0 || Array.isArray ( email ) 
                || !password || password.length === 0 || Array.isArray ( password ) 
        ) return response.status ( 400 ).json ({ message: "Missing or invalid credentials!", code: "INVALID_CREDENTIALS" });

        return await register ( email, password, response );
}