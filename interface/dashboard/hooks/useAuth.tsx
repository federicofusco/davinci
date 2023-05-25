import { auth } from "./../lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { getIdToken } from "firebase/auth"
import { useRouter } from "next/router"

import cookieCutter from "cookie-cutter"

export interface AuthFunctions {
        updateIdToken: ( forceUpdate: boolean ) => Promise<string>,
        isLoggedIn: () => boolean,
        user: any,
}

const useAuth = (): AuthFunctions => {
 
	// Hooks
	const [user, loading, error] = useAuthState ( auth );
	const router = useRouter ();

	/**
	 * Updates the user's ID token in cookies
	 */
	const updateIdToken = async ( forceUpdate: boolean ): Promise<string> => {
		return new Promise ( async ( resolve, _ ) => {

			// Verifies that the user is logged in
                        // NOTE: Using isLoggedIn() would be much simpler, but TS isn't smart enough 
                        //       to understand that if isLoggedIn() then `user` is a valid User object.
			if ( !loading && !error && user != null && user != undefined ) {

				// Parses the user cookies
				const currentToken = cookieCutter.get ( "token" );

				if ( forceUpdate || ( !currentToken || currentToken.length === 0 ) ) {

					// Generates a new token as a cookie
					const token = await getIdToken ( user );
					await cookieCutter.set ( "token", token, {
						path: "/",
						secure: true
					});

					resolve ( token );
                                        return;
				}

			} else {

				// The user isn't logged in
				router.push ( "/auth/login" );
			}

		});
	}

	/**
	 * Checks if the user is logged in
	 */
	const isLoggedIn = (): boolean => !loading && !error && user != null && user != undefined;

	return { 
		updateIdToken, 
		isLoggedIn,
		user
	};
}

export default useAuth;