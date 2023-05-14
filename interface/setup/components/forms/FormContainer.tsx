import { ReactNode } from "react";

export interface FormContainerProps {
    children?: ReactNode,
    title: string,
    subtitle?: string,
    errorMessage: string | null,
}

const FormContainer = ({ children, errorMessage, title, subtitle }: FormContainerProps ) => {
    return (
            <div className="bg-transparent w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-6 px-10">
                    <h1 className="text-4xl font-source text-gray-200">{ title }</h1>
                    {
                        subtitle && <h2 className="mt-2 font-source text-slate-400">{ subtitle }</h2>
                    }
                    {
                            errorMessage && <div className="w-full mt-3 py-2 rounded-md border border-red-500 flex">
                                    <p className="m-auto font-mono text-red-500">{ errorMessage }</p>
                            </div>
                    }
                    { children }
            </div>
    )
}

export default FormContainer;