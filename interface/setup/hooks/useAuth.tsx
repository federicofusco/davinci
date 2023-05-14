import { AuthenticationContext } from "../components/contexts/AuthenticationContext";
import { useContext } from "react";

export enum AuthenticationError {
        GENERIC = "GENERIC",
}

export interface AuthFunctions {
        authenticate: (email: string, password: string, confirmPassword: string) => Promise<void>,
}

const useAuth = (): AuthFunctions => {

        const { token: [token, setToken] } = useContext ( AuthenticationContext );

        // Makes sure the hook only runs on the client
        if (typeof window === "undefined") return {} as AuthFunctions;

        const authenticate = (email: string, password: string, confirmPassword: string): Promise<void> => {
                return new Promise ( async ( resolve, reject ) => {

                        // Checks if the passwords match
                        if ( password !== confirmPassword ) return reject ({ message: "Passwords must match!" });
                        
                        await window.fetch("http://192.168.4.1:80/api/login", {
                                method: "POST",
                                mode: "cors",
                                headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                },
                                body: new URLSearchParams({
                                        email,
                                        password,
                                        confirm_password: confirmPassword,
                                }),
                        })
                        .then(async response => {

                                // Gets the JSON response body
                                const json = await response.json();

                                // Checks if the operation was successful
                                if (json.code === "SUCCESS") {

                                        // Authenticated successfully
                                        setToken(json.token);
                                        resolve();
                                        return;
                                } else reject ({
                                        message: json.message,
                                        code: json.code
                                });
                        })
                        .catch (error => reject({
                                message: "Something went wrong! Are you connected to the right network?",
                                code: AuthenticationError.GENERIC,
                        }))
                });
        }

        return {
                authenticate,
        } as AuthFunctions;
}

export default useAuth;