import type { NextApiRequest, NextApiResponse } from "next";
import { auth, firestore } from "../../../lib/firebase_admin";
import Cors from "cors";

// Allows only PUT requests from any origin, since external devices need to interact with this endpoint
const cors = Cors ({
        methods: ["PUT"],
        origin: "*"
});

interface MetadataRequest {
        plant_name: string,
        min_humidity: number,
        allow_data_aggregation: boolean,
        jwt: string,
}

interface MetadataResponse {
        message: string,
        code: string,
}

async function upload (jwt: string, plant_name: string, min_humidity: number, allow_data_aggregation: boolean, fn: Function, response: NextApiResponse<MetadataResponse>) {

        // Verifies the ID token
        auth
                .verifyIdToken ( jwt )
                .then ( async user => {

                        // Attempts to fetch the device by their ID
                        const device_ref = firestore 
                                .collection ( "devices" )
                                .doc ( user.uid )
                                .get ()
                                .then ( device => {

                                        // Checks if the device has been registered
                                        if ( device.exists ) {

                                                // Uploads the metadata to the device
                                                firestore 
                                                        .collection ( "devices" )
                                                        .doc ( user.uid )
                                                        .update ({
                                                                metadata: {
                                                                        plant_name,
                                                                        min_humidity,
                                                                        allow_data_aggregation
                                                                }
                                                        })
                                                        .then ( () => response.status ( 200 ).json ({ message: "Uploaded metadata successfully!", code: "SUCCESS" }) )
                                                        .catch ( ({ message, code }) => response.status ( 500 ).json ({ message, code }) );
                                        }
                                })
                                .catch ( ({ message, code }) => response.status ( 500 ).json ({ message, code }) );
                }) 
                .catch ( ({ message, code }) => response.status ( 401 ).json ({ message, code }) );
}

export default async function handler ( request: NextApiRequest, response: NextApiResponse<MetadataResponse> ) {

        // Gets the user's credentials
        const { jwt, plant_name, min_humidity, allow_data_aggregation }: MetadataRequest = request.body;
        if ( 
                !jwt || jwt.length === 0 || Array.isArray(jwt)
                || !plant_name || plant_name.length === 0 || Array.isArray(plant_name)
                || !min_humidity || Array.isArray(min_humidity)
                || !allow_data_aggregation || Array.isArray(allow_data_aggregation) 
        ) return response.status ( 401 ).json ({ message: "Missing or invalid parameters!", code: "BAD_REQUEST" });

        await upload ( jwt, plant_name, min_humidity, allow_data_aggregation, cors, response );
}