import type {AppUser} from "../../Models/AppUser.ts";
import Popover from "../../lib/popover/Popover.tsx";
import {useRef, useState} from "react";
import {useAuth} from "../../Contexts/useAuth.ts";
import {useNavigate} from "react-router-dom";

const LoggedInUserCardComp = (props: { appUser: AppUser }) => {

    const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
    const { appUser, logout } = useAuth();
    const element = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    function handleOnClicked() {
        setPopoverOpened(!popoverOpened);
    }

    function closePopover() {
        setPopoverOpened(false);
    }

    function handleAccountSettingsButtonPressed() {
        navigate("/user/settings")
    }

    function handleAdministrationButtonPressed() {
        navigate("/admin/dashboard")
    }

    return (
        <div className="app-user" ref={element} onClick={handleOnClicked}>
            <p>{props.appUser.unique_name}</p>
            {popoverOpened && (
            <Popover element={element} close={closePopover} offsetX={-10} offsetY={5}>
                <div className="logged-in-user-popover">
                    <h2>{appUser?.unique_name}</h2>
                    <p>{appUser?.email}</p>
                    <button onClick={handleAccountSettingsButtonPressed}>Account settings</button>
                    <button onClick={handleAdministrationButtonPressed}>Administration</button>
                    <button onClick={logout}>Sign out</button>
                </div>
            </Popover>) }
        </div>
    )

}

export default LoggedInUserCardComp;