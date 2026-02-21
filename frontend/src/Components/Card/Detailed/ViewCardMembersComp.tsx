import UserSelector from "../../User/UserSelector/UserSelector.tsx";
import {useRef, useState} from "react";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import DefaultUserSelectorUserComp from "../../User/UserSelector/DefaultUserSelectorUserComp.tsx";
import Popover from "../../../lib/Popover/Popover.tsx";
import "./DetailedCard.css"

const ViewCardMembersComp = () => {

    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<UserGetDto[]>([]);

    const addCardMemberRef = useRef<HTMLDivElement>(null);

    function onOpenCardMembersClicked(e: React.MouseEvent<HTMLDivElement>) {
        addCardMemberRef.current = e.currentTarget;
        setIsEditingMembers(true);
    }

    return (
        <>
            <div className="card-members">
                <div onClick={onOpenCardMembersClicked} className="card-member-card" ref={addCardMemberRef}>+</div>
            </div>
            { isEditingMembers && (
                <Popover close={() => setIsEditingMembers(false)} element={addCardMemberRef} closeIfClickedOutside>
                    <UserSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} child={DefaultUserSelectorUserComp}/>
                </Popover>
            )}
        </>
    )

}

export default ViewCardMembersComp;