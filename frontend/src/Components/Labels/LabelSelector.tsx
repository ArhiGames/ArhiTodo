import Popover from "../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useRef, useState} from "react";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type { Label } from "../../Models/States/types.ts";
import "./LabelSelector.css"
import EditableLabel from "./EditableLabel.tsx";
import {type Rgb, toInteger, toRgb} from "../../lib/Functions.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {LabelGetDto} from "../../Models/BackendDtos/GetDtos/LabelGetDto.ts";

interface Props {
    element: RefObject<HTMLElement | null>,
    onClose: () => void;
    actionTitle: string;
    projectId: number;
    boardId: number;
}

const LabelSelector = ({ element, onClose, actionTitle, projectId, boardId }: Props) => {

    const labelNameInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null);
    const [labelName, setLabelName] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentlyEditingLabel, setCurrentlyEditingLabel] = useState<Label | null>(null);
    const [currentSelectedColor, setCurrentSelectedColor] = useState<Rgb>({ red: 0, green: 255, blue: 85 });
    const { token } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();

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

    useEffect(() => {
        if (isCreating) {
            labelNameInputRef.current?.focus();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLabelName("");
        }
    }, [isCreating, currentlyEditingLabel]);

    function onLabelEdit(label: Label) {
        setCurrentlyEditingLabel(label);
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

    function createEditLabel() {
        if (isCreating) {
            createLabel();
        } else if (currentlyEditingLabel !== null) {
            editLabel();
        } else {
            throw new Error("Should not be able to perform this action...");
        }

        setIsCreating(false);
        setCurrentlyEditingLabel(null);
    }

    function createLabel() {

        if (labelName.length === 0) return;

        let currentMaxId = 0;
        Object.keys(kanbanState.labels).forEach((key: string) => {
            if (currentMaxId < Number(key)) {
                currentMaxId = Number(key);
            }
        });
        const predictedId = currentMaxId + 1;

        if (dispatch) {
            dispatch({type: "CREATE_LABEL_OPTIMISTIC", payload: { boardId: boardId, labelId: predictedId,
                    labelText: labelName, labelColor: toInteger(currentSelectedColor) }});
        }

        fetch(`https://localhost:7069/api/project/${projectId}/board/${boardId}/label`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ labelText: labelName, labelColor: toInteger(currentSelectedColor) })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not create label with name ${labelName}`);
                }

                return res.json();
            })
            .then((label: LabelGetDto) => {
                if (dispatch) {
                    dispatch({ type: "CREATE_LABEL_SUCCEEDED", payload: { predictedLabelId: predictedId, actualLabelId: label.labelId }});
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({type: "CREATE_LABEL_FAILED", payload: { labelToDelete: predictedId }})
                }
                console.error(err);
            })
    }

    function editLabel() {

        if (!currentlyEditingLabel || !dispatch) return;

        dispatch({ type: "UPDATE_LABEL_OPTIMISTIC", payload: {
            labelId: currentlyEditingLabel.labelId,
                labelText: labelName.length > 0 ? labelName : currentlyEditingLabel.labelText,
                labelColor: toInteger(currentSelectedColor)
        } });

        fetch(`https://localhost:7069/api/project/${projectId}/board/${boardId}/label`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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
            })
            .catch(err => {
                console.error(err);
            })

        cancelAction();
    }

    function deleteLabel() {
        cancelAction();
        if (!currentlyEditingLabel) return;

        fetch(`https://localhost:7069/api/project/${projectId}/board/${boardId}/label/${currentlyEditingLabel.labelId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete label with name ${labelName}`);
                }

                if (dispatch) {
                    dispatch({type: "DELETE_LABEL", payload: { labelId: currentlyEditingLabel.labelId }})
                }
            })
            .catch(console.error);
    }

    function cancelAction() {
        setIsCreating(false);
        setCurrentlyEditingLabel(null);
    }

    function getActionArea() {
        return (
            <>
                <input className="classic-input"
                       placeholder={ currentlyEditingLabel !== null ? currentlyEditingLabel.labelText : "Label name"}
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
        <Popover close={onClose} element={element}>
            <div className="label-selector-popover">
                <p>{ isCreating ? "Creating label" : currentlyEditingLabel !== null ? "Editing label" : actionTitle }</p>
                {
                    (isCreating || currentlyEditingLabel !== null) ? (
                        <>
                            {getActionArea()}
                            <div style={{ display: "flex", width: "100%", gap: "0.2rem" }}>
                                <button onClick={createEditLabel}
                                        className={`button ${(labelName.length > 0 || currentlyEditingLabel !== null) ? "valid-submit-button" : "standard-button"}`}>
                                    { isCreating ? "Create" : currentlyEditingLabel !== null ? "Edit" : "buggy software..." }
                                </button>
                                <button onClick={cancelAction}
                                        className="button standard-button">Cancel</button>
                                { currentlyEditingLabel !== null && (
                                    <button onClick={deleteLabel}
                                            className="button heavy-action-button">Delete</button>
                                ) }
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="label-selector-existing">
                                {
                                    Object.values(kanbanState.labels).map((label: Label) => {
                                        if (label.boardId == boardId) {
                                            return <EditableLabel onSelected={(label: Label) => console.log(label)}
                                                                  key={label.labelId} label={label} onEditPressed={onLabelEdit}/>
                                        } else {
                                            return null
                                        }
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