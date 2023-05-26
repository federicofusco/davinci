import type { NextApiRequest, NextApiResponse } from "next";
import { auth, firestore } from "../../../lib/firebase_admin";
import { FieldValue } from "firebase-admin/firestore";
import Cors from "cors";
const uuid = require("uuid");

// Allows only PUT requests from any origin, since external devices need to interact with this endpoint
const cors = Cors ({
        methods: ["PUT"],
        origin: "*"
});

interface UploadRequest {
        location?: [number, number],
        ground?: {
                humidity: number,
        },
        air?: {
                pressure?: number,
                temperature?: number,
                humidity?: number,
        }
        pollution?: any,
        jwt: string,
}

interface UploadResponse {
        message: string,
        code: string,
        data?: any
}

async function upload (data: UploadRequest, fn: Function, response: NextApiResponse<UploadResponse>) {
        
        // Verifies the ID token
        auth
                .verifyIdToken ( data.jwt )
                .then ( async user => {

                        // Attempts to fetch the device by their ID
                        const device_ref = firestore
                                .collection ( "devices" )
                                .doc ( user.uid )
                                .get ()
                                .then ( device => {

                                        // Checks if the device has been registered
                                        if ( device.exists ) {
                                                console.log(uuid.v4())
                                                // Uploads the snapshot to the device
                                                firestore
                                                        .collection ( "devices" )
                                                        .doc ( user.uid )
                                                        .collection ( "snapshots" )
                                                        .doc ( uuid.v4() )
                                                        .set ({
                                                                timestamp: FieldValue.serverTimestamp (),
                                                                air: {
                                                                        pressure: data.air?.pressure,
                                                                        humidity: data.air?.humidity,
                                                                        temperature: data.air?.temperature,
                                                                },
                                                                ground: {
                                                                        humidity: data.ground?.humidity,
                                                                },
                                                                pollution: data.pollution
                                                        })
                                                        .then ( () => response.status ( 200 ).json ({ message: "Uploaded snapshot successfully!", code: "SUCCESS" }) )
                                                        .catch ( ({ message, code }) => response.status ( 500 ).json ({ message, code }) );

                                        } else return response.status ( 404 ).json ({ message: "Device hasn't been registered!", code: "DEVICE_NOR_REGISTERED" });
                                })
                                .catch ( ({ message, code }) => response.status ( 500 ).json ({ message, code }) );
                }) 
                .catch ( ({ message, code }) => response.status ( 401 ).json ({ message, code }) );
}

export default async function handler ( request: NextApiRequest, response: NextApiResponse<UploadResponse> ) {

        // Gets the user's credentials
        const data: UploadRequest = request.body;
        if ( !data.jwt  || Array.isArray ( data.jwt ) ) return response.status ( 401 ).json ({ message: "Missing JWT token!", code: "MISSING_TOKEN" });

        await upload ( data, cors, response );
}