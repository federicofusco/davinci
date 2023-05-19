import type { NextApiRequest, NextApiResponse } from "next";
import getAdmin from "../../../lib/firebase_admin";
import { FieldValue } from "firebase-admin/firestore";
import Cors from "cors";

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

async function upload (device_id: string, data: UploadRequest, fn: Function, response: NextApiResponse<UploadResponse>) {
        
        // Verifies the ID token
        const { auth, firestore } = getAdmin ();
        auth
                .verifyIdToken ( data.jwt )
                .then ( async user => {

                        // Checks that the device ID corresponds to the JWT
                        if (device_id !== user.uid) {
                                response.status ( 401 ).json ({ message: "JWT doesn't match the device's ID!", code: "INVALID_JWT" });
                                return;
                        }

                        // Attempts to fetch the device by their ID
                        const device_ref = firestore
                                .collection ( "devices" )
                                .doc ( user.uid )
                                .get ()
                                .then ( device => {

                                        // Checks if the device has been registered
                                        if ( device.exists ) {

                                                // Uploads the snapshot to the device
                                                firestore
                                                        .collection ( "devices" )
                                                        .doc ( user.uid )
                                                        .collection ( "snapshots" )
                                                        .doc ( "a" )
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

        // Gets the device ID
        const { device_id } = request.query;
        if ( !device_id || device_id.length === 0 || Array.isArray ( device_id ) ) return response.status ( 400 ).json ({ message: "Missing or invalid device ID!", code: "INVALID_DEVICE_ID" });

        // Gets the user's credentials
        const data: UploadRequest = request.body;
        if ( !data.jwt ) return response.status ( 401 ).json ({ message: "Missing JWT token!", code: "MISSING_TOKEN" });

        await upload ( device_id, data, cors, response );
}