import type { AppUser } from "../../Models/AppUser.ts";
import Popover from "../../lib/Popover/Popover.tsx";
import { useRef, useState } from "react";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { useNavigate } from "react-router-dom";

const LoggedInUserCardComp = (props: { appUser: AppUser }) => {

    const navigate = useNavigate();
    const { appUser, logout } = useAuth();
    const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
    const element = useRef<HTMLDivElement | null>(null);

    function handleOnClicked() {
        setPopoverOpened(true);
    }

    function closePopover() {
        setPopoverOpened(false);
    }

    function handleAccountSettingsButtonPressed(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setPopoverOpened(false);
        navigate("/user/settings");
    }

    function handleAdministrationButtonPressed(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setPopoverOpened(false);
        navigate("/admin/dashboard")
    }

    return (
        <div className="app-user" ref={element} onClick={handleOnClicked}>
            <p>{props.appUser.unique_name}</p>
            { popoverOpened && (
                <Popover element={element} close={closePopover} offsetX={-10} offsetY={5}>
                    <div className="logged-in-user-popover">
                        <h2>{appUser?.unique_name}</h2>
                        <p>{appUser?.email}</p>
                        <button onClick={handleAccountSettingsButtonPressed}>Account settings</button>
                        <button onClick={handleAdministrationButtonPressed}>Administration</button>
                        <button onClick={() => logout(true)}>Sign out</button>
                    </div>
                </Popover>)
            }
        </div>
    )

}

export default LoggedInUserCardComp;