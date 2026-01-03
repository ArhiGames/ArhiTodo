import type {DetailedCardGetDto} from "../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";
import type {ChecklistGetDto} from "../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";
import "./CardDetailChecklistsComp.css"
import CardDetailChecklistComp from "./CardDetailChecklistComp.tsx";

interface Props {
    cardDetailComp: DetailedCardGetDto;
    setCardDetailComp: (detailedCard: DetailedCardGetDto) => void;
}

const CardDetailChecklistsComp = ({ cardDetailComp, setCardDetailComp }: Props ) => {

    return (
        <>
            {
                cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                    return <CardDetailChecklistComp key={checklist.checklistId}
                                                    checklist={checklist} cardDetailComp={cardDetailComp} setCardDetailComp={setCardDetailComp}/>
                })
            }
        </>
    )

}

export default CardDetailChecklistsComp;