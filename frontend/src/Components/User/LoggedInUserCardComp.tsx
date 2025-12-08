import type {AppUser} from "../../Models/AppUser.ts";
import Popover from "../../lib/popover/Popover.tsx";
import {useRef, useState} from "react";
import {useAuth} from "../../Contexts/useAuth.ts";

const LoggedInUserCardComp = (props: { appUser: AppUser }) => {

    const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
    const { logout } = useAuth();
    const element = useRef<HTMLDivElement | null>(null);

    function handleOnClicked() {
        setPopoverOpened(!popoverOpened);
    }

    return (
        <div className="app-user" ref={element} onClick={handleOnClicked}>
            <p>{props.appUser.unique_name}</p>
            {popoverOpened && (
            <Popover element={element} offsetX={-10} offsetY={5}>
                <div className="logged-in-user-popover">
                    <h3>User configurations</h3>
                    <button>Settings</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </Popover>) }
        </div>
    )

}

export default LoggedInUserCardComp;