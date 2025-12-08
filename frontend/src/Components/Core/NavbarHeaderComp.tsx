import {Link} from "react-router-dom";
import LoggedInUserCardComp from "../User/LoggedInUserCardComp.tsx";
import {useAuth} from "../../Contexts/useAuth.ts";

const NavbarHeaderComp = () => {

    const { appUser } = useAuth();

    return (
        <nav className="navbar-header">
            <Link to="/">ArhiTodo</Link>
            { appUser ? <LoggedInUserCardComp appUser={appUser}/> : null }
        </nav>
    )
}

export default NavbarHeaderComp;