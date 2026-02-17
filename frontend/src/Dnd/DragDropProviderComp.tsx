import {DragDropProvider} from "@dnd-kit/react";
import {isSortable} from '@dnd-kit/dom/sortable';

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = ({ children }: Props) => {
    return (
        <DragDropProvider
            onDragOver={() => {

            }}
            onDragEnd={(event) => {
                if (event.canceled) return;
                const { source, target } = event.operation;

                if (isSortable(source)) {
                    console.log(source.id, target?.id);
                }
            }}
            >
            {children}
        </DragDropProvider>
    )
}

export default DragDropProviderComp;