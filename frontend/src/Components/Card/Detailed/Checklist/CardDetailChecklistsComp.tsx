import type {DetailedCardGetDto} from "../../../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";
import type {ChecklistGetDto} from "../../../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";
import "./CardDetailChecklistsComp.css"
import CardDetailChecklistComp from "./CardDetailChecklistComp.tsx";
import Popover from "../../../../lib/Popover/Popover.tsx";
import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";
import {API_BASE_URL} from "../../../../config/api.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";

interface Props {
    cardDetailComp: DetailedCardGetDto;
    setCardDetailComp: Dispatch<SetStateAction<DetailedCardGetDto | undefined>>;
}

const CardDetailChecklistsComp = ({ cardDetailComp, setCardDetailComp }: Props ) => {

    const { token, checkRefresh } = useAuth();
    const addChecklistButtonRef = useRef<HTMLButtonElement>(null);
    const addChecklistNameInputRef = useRef<HTMLInputElement>(null);
    const [isAddingChecklist, setIsAddingChecklist] = useState<boolean>(false);
    const [inputtedChecklistName, setInputtedChecklistName] = useState<string>("");

    function createChecklistLocally() {

        let predictedChecklistId = 0;
        for (const checklist of cardDetailComp.checklists) {
            if (predictedChecklistId < checklist.checklistId) {
                predictedChecklistId = checklist.checklistId;
            }
        }
        predictedChecklistId++;

        const checklist: ChecklistGetDto = { checklistId: predictedChecklistId, checklistName: inputtedChecklistName, checklistItems: [] }

        setCardDetailComp((prev: DetailedCardGetDto | undefined) => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: [
                    ...prev.checklists,
                    checklist
                ]
            }
        });
        return predictedChecklistId;

    }

    function correctPredictedChecklistLocally(predictedChecklistId: number, actual: ChecklistGetDto) {
        setCardDetailComp((prev: DetailedCardGetDto | undefined) => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: prev.checklists.map((checklist: ChecklistGetDto) => {
                    return checklist.checklistId === predictedChecklistId ? actual : checklist;
                })
            }
        });
    }

    function deleteChecklistLocally(checklistId: number) {
        setCardDetailComp((prev: DetailedCardGetDto | undefined) => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: prev.checklists.filter((checklist: ChecklistGetDto) => checklist.checklistId !== checklistId)
            }
        });
    }

    async function onCreateChecklistSubmit() {

        const predictedChecklistId = createChecklistLocally();

        const succeeded = await checkRefresh();
        if (!succeeded) {
            deleteChecklistLocally(predictedChecklistId);
            return;
        }

        fetch(`${API_BASE_URL}/card/${cardDetailComp.cardId}/checklist`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ checklistName: inputtedChecklistName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to create checklist")
                }

                return res.json();
            })
            .then((checklist: ChecklistGetDto) => {
                console.log(checklist);
                correctPredictedChecklistLocally(predictedChecklistId, checklist);
            })
            .catch(err => {
                deleteChecklistLocally(predictedChecklistId);
                console.error(err);
            })

        setIsAddingChecklist(false);
        setInputtedChecklistName("");

    }

    useEffect(() => {
        if (isAddingChecklist) {
            addChecklistNameInputRef.current?.focus();
        }
    }, [isAddingChecklist]);

    return (
        <div className="card-detail-checklists-div">
            <div className="card-details-checklist-header">
                <p>Checklists</p>
                <button ref={addChecklistButtonRef} onClick={() => setIsAddingChecklist(true)} className="button standard-button">+</button>
                {
                    isAddingChecklist && (
                        <Popover close={() => setIsAddingChecklist(false)} element={addChecklistButtonRef} closeIfClickedOutside>
                            <form onSubmit={onCreateChecklistSubmit} onReset={() => setIsAddingChecklist(false)}>
                                <input ref={addChecklistNameInputRef} placeholder="Checklist name..." className="classic-input"
                                       value={inputtedChecklistName}
                                       onChange={(e) => setInputtedChecklistName(e.target.value)}/>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button className={`button ${inputtedChecklistName.length > 0 ? "valid-submit-button" : "standard-button"}`}
                                            type="submit">Create</button>
                                    <button className="button standard-button" type="reset">Cancel</button>
                                </div>
                            </form>
                        </Popover>
                    )
                }
            </div>
            {
                cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                    return <CardDetailChecklistComp key={checklist.checklistId}
                                                    checklist={checklist} cardDetailComp={cardDetailComp} setCardDetailComp={setCardDetailComp}
                                                    createChecklistLocally={createChecklistLocally} deleteChecklistLocally={deleteChecklistLocally}/>
                })
            }
        </div>
    )

}

export default CardDetailChecklistsComp;