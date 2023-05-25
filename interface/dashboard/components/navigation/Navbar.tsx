import Logo from "../Logo";
import SignOutButton from "./SignOutButton";

const Navbar = () => {
        return <nav className="fixed top-0 backdrop-blur-[2px] z-50 w-screen h-[52px]">
                <div className="relative w-full h-full flex justify-between">
                        <Logo className="ml-6 my-auto" />
                        <SignOutButton className="mr-6 my-auto" />  
                </div>
        </nav>
}

export default Navbar;