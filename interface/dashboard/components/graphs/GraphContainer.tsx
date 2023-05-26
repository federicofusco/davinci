import { useState, ReactNode, useMemo } from "react"
import useSnapshot, { Snapshot } from "../../hooks/useSnapshot";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
);

export interface GraphContainerProps {
        title: string,
        map: ( snapshot: Snapshot ) => any, 
}

const GraphContainer = ({ title, map }: GraphContainerProps) => {
        const [hidden, setHidden] = useState<boolean> ( false );
        const { fetchSnapshots } = useSnapshot ();
        const [snapshots, setSnapshots] = useState<Snapshot[] | null> ( null );
        const [_user, loading, _error] = useAuthState ( auth );
        useMemo ( async () => {
                await fetchSnapshots ()
                        .then (data => setSnapshots(data))
                        .catch (error => console.error(Error));
        }, [loading]);

        const extractTimestamps = (): string[] => {
                let data: string[] = [];
                snapshots?.forEach ( snapshot => { 
                        const date = new Date ( snapshot.timestamp.seconds * 1000 ); // Extracts the timestamp to a JS date
                        data.push (`${date.getDate()}/${date.getUTCMonth() + 1}/${date.getFullYear ()}`) // Converts the JS date to a string
                });
                return data;
        }

        return <div className={`bg-transparent mb-3 md:mx-1 ${hidden ? "h-min" : "h-full"} transition-transform delay-200 w-full md:w-1/2 px-2 py-3 rounded-lg border border-slate-700`}>
                <div className="w-full flex justify-between h-8 px-3">
                        <h2 className="text-white my-auto">{ title }</h2>
                        <span onClick={() => setHidden ( !hidden )} className="text-white text-[10px] cursor-pointer hover:underline my-auto">{ hidden ? "Show" : "Hide" }</span>
                </div>
                { !hidden && !snapshots && <p>Loading</p>}
                { !hidden && snapshots && <Line 
                        options={{
                                responsive: true,
                                plugins: {
                                        legend: {
                                                position: 'top' as const,
                                        },
                                        title: {
                                                display: false,
                                                text: title,
                                                
                                        },
                                },
                        }} 
                        data={{
                                labels: extractTimestamps (),
                                datasets: [
                                        {
                                                label: title,
                                                data: snapshots?.map(snapshot => map ( snapshot ) ),
                                                borderColor: 'rgb(53, 162, 235)',
                                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                        },
                                ],
                        }} /> }
        </div>
}

export default GraphContainer;