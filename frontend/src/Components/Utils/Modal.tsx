import type {ReactNode} from "react";

const Modal = ( props: { children: ReactNode } ) => {
    return (
        <div>
            {props.children}
        </div>
    )
}

export default Modal;