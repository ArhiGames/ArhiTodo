import {API_BASE_URL} from "../../config/api.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {type Dispatch, type RefObject, type SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {type Rgb, toInteger, toRgb} from "../../lib/Functions.ts";
import type {LabelGetDto} from "../../Models/BackendDtos/Kanban/LabelGetDto.ts";
import {useParams} from "react-router-dom";
import type {Label} from "../../Models/States/KanbanState.ts";

interface Props {
    currentlyEditingLabelId: number | null;
    setCurrentlyEditingLabelId: Dispatch<SetStateAction<number | null>>;
    isCreating: boolean;
    setIsCreating: Dispatch<SetStateAction<boolean>>;
    cancelAction: () => void;
}

const LabelEditor = (props: Props) => {

    const { checkRefresh } = useAuth();
    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { boardId } = useParams();

    const labelNameInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null);
    const initialLabelName: string = (props.currentlyEditingLabelId ? kanbanState.labels.get(props.currentlyEditingLabelId)?.labelText : "") ?? "";
    const [labelName, setLabelName] = useState<string>(initialLabelName);
    const [currentSelectedColor, setCurrentSelectedColor] = useState<Rgb>({ red: 0, green: 255, blue: 85 });

    const selectableColors: Rgb[] = useMemo(() => [
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
    ], []);

    async function createEditLabel() {
        if (props.isCreating) {
            await createLabel();
        } else if (props.currentlyEditingLabelId !== null) {
            await editLabel();
        } else {
            throw new Error("Should not be able to perform this action...");
        }

        props.setIsCreating(false);
        props.setCurrentlyEditingLabelId(null);
    }

    async function createLabel() {

        if (labelName.length === 0 || !dispatch) return;

        const predictedId = Date.now() * -1;

        dispatch({type: "CREATE_LABEL_OPTIMISTIC", payload: { boardId: Number(boardId), labelId: predictedId,
                labelText: labelName, labelColor: toInteger(currentSelectedColor) }});

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({type: "CREATE_LABEL_FAILED", payload: { labelToDelete: predictedId }})
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/label`, {
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

        if (!props.currentlyEditingLabelId || !dispatch) return;

        const currentlyEditingLabel: Label | undefined = kanbanState.labels.get(props.currentlyEditingLabelId);
        if (!currentlyEditingLabel) return;

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

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/label`, {
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

        props.cancelAction();
    }

    async function deleteLabel() {
        props.cancelAction();
        if (!props.currentlyEditingLabelId) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/label/${props.currentlyEditingLabelId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete label with name ${labelName}`);
                }

                if (dispatch) {
                    dispatch({type: "DELETE_LABEL", payload: { labelId: props.currentlyEditingLabelId! }})
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        if (!props.currentlyEditingLabelId) return;
        props.setCurrentlyEditingLabelId(props.currentlyEditingLabelId);

        const label: Label | undefined = kanbanState.labels.get(props.currentlyEditingLabelId);
        if (!label) return;

        const labelColor: Rgb = toRgb(label.labelColor);
        for (let i = 0; i < selectableColors.length; i++) {
            if ((selectableColors[i].red === labelColor.red &&
                selectableColors[i].green === labelColor.green &&
                selectableColors[i].blue === labelColor.blue)) {

                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCurrentSelectedColor(selectableColors[i]);
                return;
            }
        }
        // return early, if we get here, no valid color was found...
        setCurrentSelectedColor(selectableColors[0]);
    }, [kanbanState.labels, props, selectableColors]);

    useEffect(() => {
        labelNameInputRef.current?.focus();
    }, [props.isCreating, props.currentlyEditingLabelId]);

    function getActionArea() {
        return (
            <>
                <input className="classic-input"
                       placeholder={ props.currentlyEditingLabelId === null ? "Label name..." : "" }
                       ref={labelNameInputRef} maxLength={24}
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
        <>
            {getActionArea()}
            <div style={{ display: "flex", width: "100%", gap: "0.2rem" }}>
                <button onClick={createEditLabel}
                        className={`button ${(labelName.length > 0 || props.currentlyEditingLabelId !== null) ? "valid-submit-button" : "standard-button"}`}>
                    { props.isCreating ? "Create" : props.currentlyEditingLabelId !== null ? "Edit" : "" }
                </button>
                <button onClick={props.cancelAction}
                        className="button standard-button">Cancel</button>
                { props.currentlyEditingLabelId !== null && (
                    <button onClick={deleteLabel}
                            className="button standard-button button-with-icon">
                        <img src="/trashcan-icon.svg" alt="" className="icon" height="22px"></img>
                        <p>Delete</p>
                    </button>
                ) }
            </div>
        </>
    )

}

export default LabelEditor;