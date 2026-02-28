import type { AppUser } from "../../../Models/AppUser.ts";
import { useRef, useState } from "react";
import LoggedInUserPopover from "./LoggedInUserPopover.tsx";

const LoggedInUserCardComp = (props: { appUser: AppUser }) => {

    const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
    const element = useRef<HTMLDivElement | null>(null);

    function handleOnClicked() {
        setPopoverOpened((prev: boolean) => !prev);
    }

    function closePopover() {
        setPopoverOpened(false);
    }

    return (
        <div className="app-user" ref={element} onClick={handleOnClicked}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <p>{props.appUser.unique_name}</p>
                <img src="/user-icon.svg" alt="" className="icon" height="38px"></img>
            </div>
            { popoverOpened && <LoggedInUserPopover element={element} onClose={closePopover}/> }
        </div>
    )

}

export default LoggedInUserCardComp;