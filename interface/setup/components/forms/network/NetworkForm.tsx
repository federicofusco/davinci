import { createRef, RefObject, FormEvent, useState, useMemo, useEffect } from "react";
import useNetwork, { Network } from "../../../hooks/useNetwork";
import { ArrowLeftCircle, ArrowLeft, ArrowRight } from "react-feather";

export interface NetworkFormProps {
        onSubmit: (ssid: string, password: string) => void,
}

const NetworkForm = ({ onSubmit }: NetworkFormProps ) => {
        const [networks, setNetworks] = useState<Network[] | null> ( null );
        const [selectedNetwork, setSelectedNetwork] = useState<Network | null> ( null );
        const { getNetworks } = useNetwork ();
        const passwordRef: RefObject<HTMLInputElement> = createRef ();

        const selectNetwork = (network: Network | null): void => setSelectedNetwork ( network );

        const submitCallback = (event: FormEvent<HTMLFormElement>): void => {
                event.preventDefault ();
                if ( passwordRef.current && selectedNetwork ) onSubmit ( selectedNetwork.ssid, passwordRef.current.value );
        } 

        useEffect(() => {
                getNetworks()
                        .then ( n => {
                                console.log(1);
                                setNetworks ( n ) 
                        })
                        .catch ( error => console.error );
        }, []);

        const [page, setPage] = useState<number> ( 0 );
        const MAX_NETWORKS = 6;

        return <>
                { !selectedNetwork && <ul>
                        { networks && networks.length > 0 && networks.map ((network, i) => page * MAX_NETWORKS <= i && i < (page + 1) * MAX_NETWORKS && 
                                <li onClick={() => selectNetwork ( network )} className="p-2 border border-slate-700 rounded-md mt-2 text-slate-400 font-source" key={ i }>
                                        <div className="flex w-full h-full justify-left">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping my-auto ml-2 mr-2"></div>
                                                <span>{ network.ssid }</span>
                                        </div>
                                </li>
                        )}
                        { networks && networks.length > MAX_NETWORKS && 
                                <div className="w-full flex justify-center">
                                        <button onClick={() => setPage ( page - 1 )} title="Previous page" disabled={ page === 0 } className={`h-11 w-11 bg-transparent border border-slate-700 rounded-md mt-2 ${ page === 0 ? "cursor-not-allowed" : "" }`}>
                                                <ArrowLeft className={`text-sm m-auto ${ page === 0 ? "text-slate-700" : "text-slate-400" }`} />
                                        </button>
                                        <button onClick={() => setPage ( page + 1)} title="Next page" disabled={ ( page + 1 ) * MAX_NETWORKS > MAX_NETWORKS } className={`ml-2 h-11 w-11 bg-transparent border border-slate-700 rounded-md mt-2 ${ ( page + 1 ) * MAX_NETWORKS > MAX_NETWORKS ? "cursor-not-allowed" : "" }`}>
                                                <ArrowRight className={`text-sm m-auto ${ ( page + 1 ) * MAX_NETWORKS > MAX_NETWORKS ? "text-slate-700" : "text-slate-400" }`} />
                                        </button>
                                </div>
                        }
                        { (!networks || networks.length === 0) && <span className="block text-center my-16 text-slate-400">Loading...</span>}
                </ul> }
                { selectedNetwork && <form onSubmit={ submitCallback }>
                        <fieldset className="mt-6 w-full bg-transparent border border-slate-700 rounded-md px-2">
                                <legend className="px-2 text-slate-400 font-source">Network</legend>
                                <input value={ selectedNetwork.ssid } disabled className="w-full pb-2 font-source bg-transparent px-2 placeholder:font-source text-grayslate-400 text-sm text-slate-400 placeholder:text-sm mx-auto outline-none" placeholder="" type="text" />
                        </fieldset>
                        <fieldset className="mt-3 w-full bg-transparent border border-slate-700 rounded-md px-2">
                                <legend className="px-2 text-slate-400 font-source">Password</legend>
                                <input ref={ passwordRef } className="w-full pb-2 font-source bg-transparent px-2 placeholder:font-source text-grayslate-400 text-sm text-slate-400 placeholder:text-sm mx-auto outline-none" placeholder="" type="password" />
                        </fieldset>

                        <div className="w-full flex justify-between">
                                <button type="button" onClick={() => selectNetwork ( null )} className="mt-6 mr-2 w-10 h-10 bg-transparent ">
                                        <ArrowLeftCircle className="m-auto text-slate-400" />
                                </button>
                                <button type="submit" className="mt-6 w-full rounded-md h-10 bg-green-500">
                                        <p className="font-source text-white font-bold">Login</p>
                                </button>
                        </div>
                 </form> }
        </>
}

export default NetworkForm;