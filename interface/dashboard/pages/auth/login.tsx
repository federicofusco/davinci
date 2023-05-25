import useAuth from "./../../hooks/useAuth";
import { auth } from "./../../lib/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FormContainer from "../../components/forms/FormContainer";
import LoginForm from "../../components/forms/LoginForm"; 
import { useSnackbar } from "notistack";

const Auth = () => {
        const router = useRouter ();
        const { enqueueSnackbar } = useSnackbar ();
        const { updateIdToken } = useAuth ();
        const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword ( auth );

        useEffect (() => {
                if ( error ) enqueueSnackbar ( error.message, { variant: "error", autoHideDuration: 3000 })
        }, [error, enqueueSnackbar]);

        useEffect (() => {

                // Checks if the user is logged in
		if ( !loading && user && !error ) {

			updateIdToken ( true )
				.then ( () => {

					// Redirects the user
                                        const redirect = router.query.redirect;
                                        enqueueSnackbar ( "Signed in!", { variant: "success", autoHideDuration: 3000 })
                                        router.push ( redirect && !Array.isArray ( redirect ) && redirect.length > 0 ? redirect : "/dashboard"  );
				})
				.catch ( ({ message }) => enqueueSnackbar ( message, { variant: "error", autoHideDuration: 3000 }) );
		}
        }, [user, loading, error, updateIdToken, router]);

        return (
                <FormContainer title="Sign In" subtitle="Sign into your Midori account to track your plant!">
                        <LoginForm action="Sign In" onSubmit={ signInWithEmailAndPassword } />
                </FormContainer>
        )
}

export default Auth;