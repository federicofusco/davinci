import { createRef, RefObject, FormEvent } from "react";

export interface LoginFormProps {
        action: string,
        onSubmit: (email: string, password: string) => Promise<any>,
}

const LoginForm = ({ action, onSubmit }: LoginFormProps ) => {
        const emailRef: RefObject<HTMLInputElement> = createRef ();
        const passwordRef: RefObject<HTMLInputElement> = createRef ();
        const callback = (event: FormEvent<HTMLFormElement>) => {
                event.preventDefault ();
                if ( emailRef.current && passwordRef.current ) onSubmit ( emailRef.current.value, passwordRef.current.value );
        };

        return (
                <form onSubmit={ callback }>
                        <fieldset className="mt-6 w-full bg-transparent border border-slate-700 rounded-md px-2">
                                <legend className="px-2 text-slate-400 font-source">Email</legend>
                                <input ref={ emailRef } className="w-full pb-2 font-source bg-transparent px-2 placeholder:font-source text-grayslate-400 text-sm text-slate-400 placeholder:text-sm mx-auto outline-none" placeholder="example@gmail.com" type="text" />
                        </fieldset>
                        <fieldset className="mt-3 w-full bg-transparent border border-slate-700 rounded-md px-2">
                                <legend className="px-2 text-slate-400 font-source">Password</legend>
                                <input ref={ passwordRef } className="w-full pb-2 font-source bg-transparent px-2 placeholder:font-source text-grayslate-400 text-sm text-slate-400 placeholder:text-sm mx-auto outline-none" placeholder="Super secret password" type="password" />
                        </fieldset>

                        <button type="submit" className="mt-6 w-full rounded-md h-10 bg-green-500">
                                <p className="font-source text-white font-bold">{ action }</p>
                        </button>
                </form>
        )
}

export default LoginForm;