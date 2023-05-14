import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { useState } from "react";
import FormContainer from "../../components/forms/FormContainer";
import LoginForm from "../../components/forms/login/LoginForm"; 
import Background from "../../components/Background";

const Auth = () => {
        const { authenticate } = useAuth ();
        const router = useRouter ();
        const [errorMessage, setErrorMessage] = useState<string | null> ( null );
        

        const login = async ( username: string, password: string, confirmPassword: string ): Promise<void> => {
                await authenticate ( username, password, confirmPassword )
                                .then ( _ => router.push ( "/setup/settings" ) )
                                .catch ( error => setErrorMessage ( error.message ) );
        }

        return <>
                <Background />
                <FormContainer title="Sign up" subtitle="Create your $vase$ account to continue and track your plant!" errorMessage={ errorMessage }>
                        <LoginForm action="Sign up" onSubmit={ login } />
                </FormContainer>
        </>
}

export default Auth;