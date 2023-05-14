import { useRouter } from "next/router";
import { useState } from "react";
import FormContainer from "../../components/forms/FormContainer";
import NetworkForm from "../../components/forms/network/NetworkForm";
import useNetwork from "../../hooks/useNetwork";
import Background from "../../components/Background";

const Network = () => {
        const router = useRouter ();
        const [errorMessage, setErrorMessage] = useState<string | null> ( null );
        const { connect } = useNetwork ();

        const attemptConnection = async (ssid: string, password: string): Promise<void> => {
                connect (ssid, password)
                        .then (() => router.push ("/setup/auth") )
                        .catch (error => setErrorMessage ( error.message ) );
        }

        return <>
                <Background />
                <FormContainer title="Select Network" subtitle="Select the WiFi network the $vase$ should use." errorMessage={ errorMessage }>
                        <NetworkForm onSubmit={ attemptConnection } />
                </FormContainer>
        </>
}

export default Network;