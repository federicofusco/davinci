import { useRouter } from "next/router";
import { useState } from "react";
import FormContainer from "../../components/forms/FormContainer";
import SetupForm from "../../components/forms/setup/SetupForm";
import useSetup from "../../hooks/useSetup";
import Background from "../../components/Background";

const Settings = () => {
        const router = useRouter ();
        const [errorMessage, setErrorMessage] = useState<string | null> ( null );
        const { setup } = useSetup ();

        const finishSetup = (plant_name: string, min_humidity: number, allow_data_aggregation: boolean): void => {
                setup (plant_name, min_humidity, allow_data_aggregation)
                        .then(() => router.push("/setup/finish"))
                        .catch((error) => setErrorMessage(error.message));
        }

        return <>
                <Background />
                <FormContainer title="Almost there." subtitle="Just need to fill out a couple of things:" errorMessage={ errorMessage }>
                        <SetupForm onSubmit={ finishSetup } />
                </FormContainer>
        </>
}

export default Settings;