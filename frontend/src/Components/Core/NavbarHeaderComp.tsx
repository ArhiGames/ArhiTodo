import {Link} from "react-router-dom";
import UserCardComp from "../User/UserCardComp.tsx";
import {useAuth} from "../../Contexts/useAuth.ts";

const NavbarHeaderComp = () => {

    const { appUser } = useAuth();

    return (
        <nav className="navbar-header">
            <Link to="/">ArhiTodo</Link>
            { appUser ? <UserCardComp appUser={appUser}/> : null }
        </nav>
    )
}

export default NavbarHeaderComp;