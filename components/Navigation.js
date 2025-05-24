import { ImStatsDots,ImSearch } from "react-icons/im";
import { useContext } from "react";
import { authContext } from "@/lib/store/auth-context";

function Nav() {
    const { user, loading, logout } = useContext(authContext);

    return (
        <header className="container max-w-2xl py-6 mx-auto">{/*px-2*/}
            <div className="flex items-center justify-between">
                {/* User Info */}
                {user && !loading && (
                    <div className="flex items-center gap-2">
                        <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
                            <img className="object-cover w-full h-full" src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                        </div>
                        <small className="text-2xl">Hi, {user.displayName}!!</small>
                    </div>
                )}

                {/* Right Side Navigation */}
                {user && !loading && (
                    <nav className="flex items-center gap-4">
                         <a href="#Search">
                            <ImSearch className="text-2xl" />
                        </a>
                        <a href="#Stats">
                            <ImStatsDots className="text-2xl" />
                        </a>
                        <button onClick={logout} className="btn btn-danger">Sign Out</button>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Nav;
