import { useContext } from "react";
import { AuthenticationContext } from "../components/contexts/AuthenticationContext";

export enum SetupError {
        NO_TOKEN = "NO_TOKEN",
        GENERIC = "GENERIC",
}

export interface SetupFunctions {
        setup: (plant_name: string, min_humidity: number, allow_data_aggregation: boolean) => Promise<void>,
}

const useSetup = (): SetupFunctions => {

        const { token: [token, setToken] } = useContext ( AuthenticationContext );

        const setup = (plant_name: string, min_humidity: number, allow_data_aggregation: boolean): Promise<void> => {
                return new Promise ( async ( resolve, reject ) => {

                        // Checks if the token is present
                        if (!token) {
                                reject ({
                                        message: "Missing token!",
                                        code: SetupError.NO_TOKEN,
                                });
                                return;
                        }
                        
                        await window.fetch("http://192.168.4.1:80/api/setup", {
                                method: "PUT",
                                mode: "cors",
                                headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                },
                                body: new URLSearchParams({
                                        token,
                                        plant_name,
                                        min_humidity: (min_humidity).toString(10),
                                        allow_data_aggregation: allow_data_aggregation.toString(),
                                }),
                        })
                        .then(async response => {

                                // Gets the JSON response body
                                const json = await response.json();

                                // Checks if the operation was successful
                                if (json.code === "SUCCESS") {

                                        // Authenticated successfully
                                        resolve();
                                        return;
                                } else reject ({
                                        message: json.message,
                                        code: json.code
                                });
                        })
                        .catch (error => reject({
                                message: "Something went wrong! Are you connected to the right network?",
                                code: SetupError.GENERIC,
                        }))
                });
        }

        return {
                setup,
        } as SetupFunctions;
}

export default useSetup;