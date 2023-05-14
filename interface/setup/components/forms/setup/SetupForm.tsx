import { RefObject, createRef, useState } from "react";
import { FormEvent } from "react";
import Slider from "react-input-slider";

export interface SetupFormProps {
        onSubmit: (plant_name: string, min_humidity: number, allow_data_aggregation: boolean) => void,
}

const SetupForm = ({ onSubmit }: SetupFormProps) => {
        const [minHumidity, setMinHumidity] = useState<number> ( 30 );
        const plantNameRef: RefObject<HTMLInputElement> = createRef ();


        const callback = (event: FormEvent<HTMLFormElement> ): void => {
                event.preventDefault();
                if (plantNameRef.current) onSubmit(plantNameRef.current.value, minHumidity, true);
        }
        
        return <form onSubmit={ callback }>
                <fieldset className="mt-6 w-full bg-transparent border border-slate-700 rounded-md px-2">
                        <legend className="px-2 text-slate-400 font-source">Plant Name</legend>
                        <input ref={ plantNameRef } placeholder="e.i Jane" className="w-full pb-2 font-source bg-transparent px-2 placeholder:font-source placeholder:text-slate-600 text-sm text-slate-400 placeholder:text-sm mx-auto outline-none" type="text" />
                </fieldset>
                <fieldset className="mt-3 w-full bg-transparent border border-slate-700 rounded-md px-2">
                        <legend className="px-2 text-slate-400 font-source">Minimum humidity</legend>
                        <div className="w-full flex justify-between m-2">
                                <span className="m-auto text-xs text-gray-400 mr-2">25%</span>
                                <Slider styles={{track:{width: "95%", margin: "auto"}}} axis="x" x={ minHumidity } xmin={ 25 } xmax={ 75 } onChange={(x) => setMinHumidity(x.x)} />
                                <span className="m-auto text-xs text-gray-400 mx-2">75%</span>
                        </div>
                </fieldset>

                <button type="submit" className="mt-6 w-full rounded-md h-10 bg-green-500">
                        <p className="font-source text-white font-bold">Finish</p>
                </button>
        </form>;
}

export default SetupForm;