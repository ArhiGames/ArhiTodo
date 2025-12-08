import type {AppUser} from "../../Models/AppUser.ts";
import Popover from "../../lib/popover/Popover.tsx";
import {useRef, useState} from "react";
import {useAuth} from "../../Contexts/useAuth.ts";

const LoggedInUserCardComp = (props: { appUser: AppUser }) => {

    const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
    const { appUser, logout } = useAuth();
    const element = useRef<HTMLDivElement | null>(null);

    function handleOnClicked() {
        setPopoverOpened(!popoverOpened);
    }

    function closePopover() {
        setPopoverOpened(false);
    }

    return (
        <div className="app-user" ref={element} onClick={handleOnClicked}>
            <p>{props.appUser.unique_name}</p>
            {popoverOpened && (
            <Popover element={element} close={closePopover} offsetX={-10} offsetY={5}>
                <div className="logged-in-user-popover">
                    <h2>{appUser?.unique_name}</h2>
                    <p>{appUser?.email}</p>
                    <button>Account settings</button>
                    <button>Administration</button>
                    <button onClick={logout}>Sign out</button>
                </div>
            </Popover>) }
        </div>
    )

}

export default LoggedInUserCardComp;