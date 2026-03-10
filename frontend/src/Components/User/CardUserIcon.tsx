import type {PublicUserGetDto} from "../../Models/States/KanbanState.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import "./CardUserIcon.css"
import {useRef, useState} from "react";
import Popover from "../../lib/Popover/Popover.tsx";
import GeneralUserViewerComp from "./GeneralUserViewerComp.tsx";

interface Props {
    user: PublicUserGetDto;
    size: "small" | "medium" | "large";
    canViewDetails?: boolean;
    onClick?: (element: React.MouseEvent<HTMLDivElement>) => void;
}

const CardUserIcon = (props: Props) => {

    const { appUser } = useAuth();
    const [isShowingDetails, setIsShowingDetails] = useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    function onCardUserIconClick(e: React.MouseEvent<HTMLDivElement>) {
        if (props.canViewDetails) {
            setIsShowingDetails((prev: boolean) => !prev);
        }

        if (props.onClick) {
            props.onClick(e);
        }
    }

    return (
        <>
            <div onClick={onCardUserIconClick} ref={popoverRef} className={`card-member-card ${props.size} ${appUser?.id === props.user.userId ? "self" : ""}`}>
                {props.user.userName.slice(0, 2)}
            </div>
            {isShowingDetails && (
                <Popover close={() => setIsShowingDetails(false)} element={popoverRef} triggerElement={popoverRef}>
                    <div className="card-user-icon-viewer">
                        <GeneralUserViewerComp user={props.user} options={{ showProjectOwner: true, showBoardOwner: true }}/>
                    </div>
                </Popover>
            )}
        </>
    )

}

export default CardUserIcon;