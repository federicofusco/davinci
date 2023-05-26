import { useRouter } from "next/router";

const Home = () => {
        const router = useRouter ();
        router.push ("/auth/login");
        
        return null;
}

export default Home;