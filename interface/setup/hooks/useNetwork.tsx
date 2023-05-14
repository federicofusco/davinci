export interface Network {
        ssid: string,
        rssi: number,
}

export interface NetworkFunctions {
        getNetworks: () => Promise<Network[]>,
        connect: (ssid: string, password: string) => Promise<void>,
}

export enum NetworkErrors {
        NO_TOKEN = "NO_TOKEN",
        GENERIC = "GENERIC",
}

const useNetwork = (): NetworkFunctions => {

        if ( typeof window === "undefined" ) return {} as NetworkFunctions;

        const getNetworks = (): Promise<Network[]> => {
                return new Promise ( async ( resolve, reject ) => {

                        await window.fetch("http://192.168.4.1:80/api/networks", {
                                method: "POST",
                                mode: "cors",
                                headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                },
                        })
                        .then(async response => {
                                const json = await response.json ();
                                if (json.code === "SUCCESS") {
                                        resolve (JSON.parse(json.data));
                                        return;
                                } else reject ();
                        })
                        .catch(error => reject({
                                message: "Something went wrong! Are you connected to the right network?",
                                code: NetworkErrors.GENERIC,
                        }));
                });
        }

        const connect = (ssid: string, password: string): Promise<void> => {
                return new Promise ( async ( resolve, reject ) => {

                        await window.fetch("http://192.168.4.1:80/api/networks", {
                                method: "PUT",
                                mode: "cors",
                                headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                },
                                body: new URLSearchParams({ 
                                        ssid,
                                        password,
                                }),
                        })
                        .then(async response => {
                                const json = await response.json ();
                                if (json.code === "SUCCESS") {
                                        resolve ();
                                        return;
                                } else reject ({
                                        message: json.message,
                                        code: json.code,
                                });
                        })
                        .catch(error => reject({
                                message: "Something went wrong! Are you connected to the right network?",
                                code: NetworkErrors.GENERIC,
                        }));
                });
        }

        return {
                getNetworks,
                connect,
        } as NetworkFunctions;
}

export default useNetwork;