import Popover from "../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useRef, useState} from "react";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type { Label } from "../../Models/States/types.ts";
import "./LabelSelector.css"
import EditableLabel from "./EditableLabel.tsx";
import {type Rgb, toInteger, toRgb} from "../../lib/Functions.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {LabelGetDto} from "../../Models/BackendDtos/Kanban/LabelGetDto.ts";
import {API_BASE_URL} from "../../config/api.ts";

interface Props {
    element: RefObject<HTMLElement | null>,
    onClose: () => void;
    onLabelSelected: (labelId: number) => void;
    onLabelUnselected: (labelId: number) => void;
    selectedLabels: number[];
    actionTitle: string;
    projectId: number;
    boardId: number;
}

const LabelSelector = ( props: Props ) => {

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();

    const labelNameInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null);
    const [labelName, setLabelName] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentlyEditingLabelId, setCurrentlyEditingLabelId] = useState<number | null>(null);
    const [currentSelectedColor, setCurrentSelectedColor] = useState<Rgb>({ red: 0, green: 255, blue: 85 });

    const selectableColors: Rgb[] = [
        { red: 0, green: 255, blue: 85 },
        { red: 0, green: 204, blue: 102 },
        { red: 0, green: 153, blue: 68 },
        { red: 0, green: 102, blue: 51 },
        { red: 0, green: 61, blue: 32 },

        { red: 255, green: 255, blue: 102 },
        { red: 255, green: 221, blue: 51 },
        { red: 255, green: 187, blue: 0 },
        { red: 255, green: 153, blue: 0 },
        { red: 204, green: 102, blue: 0 },

        { red: 255, green: 192, blue: 203 },
        { red: 255, green: 102, blue: 102 },
        { red: 204, green: 51, blue: 51 },
        { red: 153, green: 0, blue: 0 },
        { red: 102, green: 0, blue: 0 },

        { red: 0, green: 255, blue: 230 },
        { red: 0, green: 191, blue: 204 },
        { red: 0, green: 135, blue: 204 },
        { red: 0, green: 51, blue: 204 },
        { red: 0, green: 26, blue: 153 },

        { red: 204, green: 153, blue: 255 },
        { red: 153, green: 102, blue: 255 },
        { red: 102, green: 51, blue: 204 },
        { red: 51, green: 26, blue: 153 },
        { red: 26, green: 0, blue: 102 },
    ];

    function cancelAction() {
        setIsCreating(false);
        setCurrentlyEditingLabelId(null);
    }

    useEffect(() => {
        if (isCreating) {
            labelNameInputRef.current?.focus();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLabelName("");
        }
    }, [isCreating, currentlyEditingLabelId]);

    useEffect(() => {

        if (!currentlyEditingLabelId) return;
        if (!kanbanState.labels[currentlyEditingLabelId]) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            cancelAction();
        }

    }, [currentlyEditingLabelId, kanbanState.labels]);

    function onLabelEdit(labelId: number) {
        setCurrentlyEditingLabelId(labelId);

        const label = kanbanState.labels[labelId];
        const labelColor: Rgb = toRgb(label.labelColor);
        for (let i = 0; i < selectableColors.length; i++) {
            if ((selectableColors[i].red === labelColor.red &&
                selectableColors[i].green === labelColor.green &&
                selectableColors[i].blue === labelColor.blue)) {

                setCurrentSelectedColor(selectableColors[i]);
                return;
            }
        }
        // return early, if we get here, no valid color was found...
        setCurrentSelectedColor(selectableColors[0]);
    }

    async function createEditLabel() {
        if (isCreating) {
            await createLabel();
        } else if (currentlyEditingLabelId !== null) {
            await editLabel();
        } else {
            throw new Error("Should not be able to perform this action...");
        }

        setIsCreating(false);
        setCurrentlyEditingLabelId(null);
    }

    async function createLabel() {

        if (labelName.length === 0 || !dispatch) return;

        const predictedId = Date.now() * -1;

        dispatch({type: "CREATE_LABEL_OPTIMISTIC", payload: { boardId: props.boardId, labelId: predictedId,
                labelText: labelName, labelColor: toInteger(currentSelectedColor) }});

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({type: "CREATE_LABEL_FAILED", payload: { labelToDelete: predictedId }})
            return;
        }

        fetch(`${API_BASE_URL}/board/${props.boardId}/label`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ labelText: labelName, labelColor: toInteger(currentSelectedColor) })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not create label with name ${labelName}`);
                }

                return res.json();
            })
            .then((label: LabelGetDto) => {
                dispatch({ type: "CREATE_LABEL_SUCCEEDED", payload: { predictedLabelId: predictedId, actualLabelId: label.labelId }});
            })
            .catch(err => {
                dispatch({type: "CREATE_LABEL_FAILED", payload: { labelToDelete: predictedId }})
                console.error(err);
            })
    }

    async function editLabel() {

        if (!currentlyEditingLabelId || !dispatch) return;

        const currentlyEditingLabel = kanbanState.labels[currentlyEditingLabelId];
        const oldLabelText: string = currentlyEditingLabel.labelText;
        const oldLabelColor: number = currentlyEditingLabel.labelColor;

        dispatch({ type: "UPDATE_LABEL", payload: {
            labelId: currentlyEditingLabel.labelId,
            labelText: labelName.length > 0 ? labelName : currentlyEditingLabel.labelText,
            labelColor: toInteger(currentSelectedColor)
        } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_LABEL", payload: {
                labelId: currentlyEditingLabel.labelId,
                labelText: oldLabelText,
                labelColor: oldLabelColor
            } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${props.boardId}/label`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({
                labelId: currentlyEditingLabel.labelId,
                labelText: labelName.length > 0 ? labelName : currentlyEditingLabel.labelText,
                labelColor: toInteger(currentSelectedColor)
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not edit label with name ${labelName}`);
                }

                return res.json();
            })
            .then((label: LabelGetDto) => {
                dispatch({ type: "UPDATE_LABEL", payload: {
                    labelId: currentlyEditingLabel.labelId,
                    labelText: label.labelText,
                    labelColor: label.labelColor
                } });
            })
            .catch(err => {
                dispatch({ type: "UPDATE_LABEL", payload: {
                    labelId: currentlyEditingLabel.labelId,
                    labelText: oldLabelText,
                    labelColor: oldLabelColor
                } });
                console.error(err);
            })

        cancelAction();
    }

    async function deleteLabel() {
        cancelAction();
        if (!currentlyEditingLabelId) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${props.boardId}/label/${currentlyEditingLabelId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete label with name ${labelName}`);
                }

                if (dispatch) {
                    dispatch({type: "DELETE_LABEL", payload: { labelId: currentlyEditingLabelId }})
                }
            })
            .catch(console.error);
    }

    function getActionArea() {
        return (
            <>
                <input className="classic-input"
                       placeholder={ currentlyEditingLabelId !== null ? kanbanState.labels[currentlyEditingLabelId]?.labelText : "Label name..."}
                       ref={labelNameInputRef} maxLength={35}
                       value={labelName} onChange={(e) => setLabelName(e.target.value)}></input>
                <p>Color:</p>
                <div className="color-selector">
                    { selectableColors.map((color, index) => {
                        return <button key={index} style={{ backgroundColor: `rgb(${color.red},${color.green},${color.blue})` }}
                                       onClick={() => setCurrentSelectedColor(color)}
                                       className={`selectable-color${(currentSelectedColor.red === color.red &&
                                           currentSelectedColor.green === color.green &&
                                           currentSelectedColor.blue === color.blue)
                                           ? " selected-selectable-color" : ""}`}/>
                    })}
                </div>
            </>
        )
    }

    return (
        <Popover close={props.onClose} element={props.element}>
            <div className="label-selector-popover">
                <p>{ isCreating ? "Creating label" : currentlyEditingLabelId !== null ? "Editing label" : props.actionTitle }</p>
                {
                    (isCreating || currentlyEditingLabelId !== null) ? (
                        <>
                            {getActionArea()}
                            <div style={{ display: "flex", width: "100%", gap: "0.2rem" }}>
                                <button onClick={createEditLabel}
                                        className={`button ${(labelName.length > 0 || currentlyEditingLabelId !== null) ? "valid-submit-button" : "standard-button"}`}>
                                    { isCreating ? "Create" : currentlyEditingLabelId !== null ? "Edit" : "buggy software..." }
                                </button>
                                <button onClick={cancelAction}
                                        className="button standard-button">Cancel</button>
                                { currentlyEditingLabelId !== null && (
                                    <button onClick={deleteLabel}
                                            className="button standard-button button-with-icon">
                                            <img src="/trashcan-icon.svg" alt="" className="icon" height="22px"></img>
                                            <p>Delete</p>
                                    </button>
                                ) }
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="label-selector-existing scroller">
                                {
                                    Object.values(kanbanState.labels).map((label: Label) => {
                                        return ( label.boardId == props.boardId && (
                                            <EditableLabel key={label.labelId} label={label} onEditPressed={onLabelEdit}
                                                           isSelected={ props.selectedLabels.includes(label.labelId) }
                                                           onLabelSelected={(labelId: number) => props.onLabelSelected(labelId)}
                                                           onLabelUnselected={(labelId: number) => props.onLabelUnselected(labelId)}/>
                                        ) )
                                    })
                                }
                            </div>
                            <button onClick={() => setIsCreating(true)} className="button standard-button create-label-button">Create label</button>
                        </>
                    )
                }

            </div>
        </Popover>
    )

}

export default LabelSelector;