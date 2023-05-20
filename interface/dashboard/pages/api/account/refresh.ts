import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Cors from "cors";

// Allows only PUT requests from any origin, since external devices need to interact with this endpoint
const cors = Cors ({
        methods: ["POST"],
        origin: "*"
});

interface RefreshRequest {
        refresh_token: string
}

interface RefreshResponse {
        message: string,
        code: string,
        data?: any
}

async function refresh ( refresh_token: string, fn: Function, response: NextApiResponse<RefreshResponse> ) {
        
        // Attempts to refresh the token
        axios ({
                method: "post",
                baseURL: `https://securetoken.googleapis.com`,
                url: "/v1/token",
                headers: {
                        "Content-Type": "application/json",
                },
                params: {
                        grant_type: "refresh_token",
                        refresh_token,
                        key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
                },
                responseType: "json",
        })
        .then ( result => response.status ( result.status ).json ({ message: "Successfully refreshed token!", code: "SUCCESS", data: result.data }) )
        .catch ( error => response.status ( 500 ).json ({ message: "Something went wrong!", code: "GENERIC_ERROR" }) );
}

export default async function handler ( request: NextApiRequest, response: NextApiResponse<RefreshResponse> ) {

        // Gets the user's credentials
        const { refresh_token }: RefreshRequest = request.body;
        if (!refresh_token || refresh_token.length === 0 || Array.isArray ( refresh_token ) ) return response.status ( 400 ).json ({ message: "Missing or invalid refresh token!", code: "INVALID_CREDENTIALS" });

        await refresh ( refresh_token, cors, response );
}