import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";

export interface SignOutButtonProps {
        className?: string,
}

const SignOutButton = ({ className }: SignOutButtonProps) => {
        const [_signOut, loading, error] = useSignOut ( auth );
        const router = useRouter ();
        const { enqueueSnackbar } = useSnackbar ();

        const signOut = () => {
                _signOut ()
                        .then (() => {
                                enqueueSnackbar ( "Signed out!", {
                                        variant: "success",
                                        autoHideDuration: 3000
                                });
                                router.push ( "/auth/login" );
                        })
                        .catch (() => enqueueSnackbar ( "Failed to sign out!", { variant: "error", autoHideDuration: 3000 }))
        }

        return <button onClick={ signOut } className={`block rounded-md h-8 text-green-500 text-md px-3 font-bold border bg-transparent border-green-500 ${ className }`}>
                Sign out
        </button>
}

export default SignOutButton;