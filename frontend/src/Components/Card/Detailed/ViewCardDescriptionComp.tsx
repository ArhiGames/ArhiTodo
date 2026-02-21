import {Fragment, useEffect, useRef, useState} from "react";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import {useParams} from "react-router-dom";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";

const ViewCardDescriptionComp = () => {

    const permissions = usePermissions();
    const { checkRefresh } = useAuth();
    const { cardId } = useParams();
    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();

    const currentStateDescription: string = kanbanState.cards.get(Number(cardId))?.cardDescription ?? "";
    const [inputtedDescription, setInputtedDescription] = useState<string>(currentStateDescription);

    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
    const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {

        if (isEditingDescription) {
            if (!descriptionInputRef.current) return;

            descriptionInputRef.current.focus();
            descriptionInputRef.current.setSelectionRange(inputtedDescription.length, inputtedDescription.length);
        }

    }, [isEditingDescription]);

    async function updateCardDescription(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            resetCardDescription();
            return;
        }

        if (dispatch) {
            dispatch({
                type: "UPDATE_CARD_DESCRIPTION",
                payload: {cardId: Number(cardId), description: inputtedDescription}
            });
        }

        fetch(`${API_BASE_URL}/card/${Number(cardId)}/description`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ newCardDescription: inputtedDescription })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to update card description");
                }
            })
            .catch(err => {
                resetCardDescription();
                console.error(err);
            })

        setIsEditingDescription(false);
    }

    function resetFormCardDescription(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        resetCardDescription();
    }

    function resetCardDescription() {
        setInputtedDescription(currentStateDescription);
        setIsEditingDescription(false);
    }

    function onEditCardDescriptionPressed() {
        if (!permissions.hasManageCardsPermission()) return;
        setIsEditingDescription(true);
    }

    return (
        <form onSubmit={updateCardDescription} onReset={resetFormCardDescription}>
            {
                isEditingDescription ? (
                    <>
                        <textarea value={inputtedDescription} ref={descriptionInputRef}
                                  placeholder="This card currently does not have a description..."
                                  onChange={(e) => setInputtedDescription(e.target.value)}
                                  maxLength={8192}/>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className={`button ${ inputtedDescription !== currentStateDescription ?
                                "valid-submit-button" : "standard-button" }`}
                                    type="submit">Save description</button>
                            <button type="reset" className="button standard-button">Cancel</button>
                        </div>
                    </>
                ) : (
                    <p onClick={onEditCardDescriptionPressed}
                       className="card-detailed-description">{ currentStateDescription.length > 0 ?
                        currentStateDescription.split('\n').map((line, idx) => (
                            <Fragment key={idx}>
                                {line}
                                <br/>
                            </Fragment>
                        )) : "This card currently does not have a description..." }</p>
                )
            }
        </form>
    )

}

export default ViewCardDescriptionComp;