import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import useAuth from "./useAuth";

export interface Device {
        metadata: {
                allow_data_aggregation: boolean,
                min_humidity: number,
                plant_name: string,
        },
        owner: string,
};

export interface Snapshot {
        air: {
                humidity: number,
                pressure: number,
                temperature: number,
        },
        ground: {
                humidity: number,
        },
        timestamp: any,
};

export interface SnapshotFunctions {
        fetchDevice: () => Promise<Device>,
        fetchSnapshots: () => Promise<Snapshot[]>,
}

const useSnapshot = (): SnapshotFunctions => {
        const [user, loading, error] = useAuthState ( auth );
        const { isLoggedIn } = useAuth ();

        const fetchDevice = (): Promise<Device> => {
                return new Promise ( async ( resolve, reject ) => {
                        
                        // Checks if the user is logged in
                        if ( !loading && !error && user != null && user != undefined ) {

                                // Fetches the device
                                const device = await getDoc ( doc ( firestore, "devices", user.uid ) );
                                if ( device.exists () ) {
                                        const device_data = device.data (); 
                                        resolve ( device_data as Device );
                                } else {
                                        reject ("Device not found!");
                                }
                        } else reject ( "Not signed in!" );
                });
        }

        const fetchSnapshots = (): Promise<Snapshot[]> => {
                return new Promise ( async ( resolve, reject ) => {
                        
                        // Checks if the user is logged in
                        if ( !loading && !error && user != null && user != undefined ) {

                                // Fetches the snapshots
                                let data: Snapshot[] = [];
                                const snapshots = collection ( firestore, "devices", user.uid, "snapshots" );
                                const snapshotQuery = await getDocs ( snapshots );
                                snapshotQuery.forEach(d => data.push ( d.data () as Snapshot ));
                                resolve ( data );
                        } else reject ( "Not signed in!" );
                });
        }

        return {
                fetchDevice,
                fetchSnapshots,
        };
}

export default useSnapshot;