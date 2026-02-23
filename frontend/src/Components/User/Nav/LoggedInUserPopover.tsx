import Popover from "../../../lib/Popover/Popover.tsx";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {useNavigate} from "react-router-dom";
import type {RefObject} from "react";
import "./LoggedInUser.css"

interface Props {
    element: RefObject<HTMLElement | null>;
    onClose: () => void;
}

const LoggedInUserPopover = (props: Props) => {

    const navigate = useNavigate();
    const { appUser, jwtPayload, logout } = useAuth();

    function handleAccountSettingsButtonPressed(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        props.onClose();
        navigate("/user/settings");
    }

    function handleAdministrationButtonPressed(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        props.onClose();
        navigate("/admin/dashboard")
    }

    return (
        <Popover element={props.element} close={props.onClose} offsetX={-10} offsetY={5}>
            <div className="logged-in-user-popover">
                <h2>{appUser?.unique_name}</h2>
                <p>{appUser?.email}</p>
                <button className="button standard-button" onClick={handleAccountSettingsButtonPressed}>Account settings</button>
                { jwtPayload?.AccessAdminDashboard === "True" && <button className="button standard-button" onClick={handleAdministrationButtonPressed}>Administration</button> }
                <button className="button standard-button" onClick={() => logout(true)}>Sign out</button>
            </div>
        </Popover>
    )

}

export default LoggedInUserPopover;