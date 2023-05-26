import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
        const router = useRouter ();
        
        useEffect (() => {
                router.push ( "/auth/login" );
        }, []);
        
        return <div className="w-screen h-screen flex justify-center">
                <p className="text-center w-full text-white my-auto">Redirecting. Please wait...</p>
        </div>;
}

export default Home;