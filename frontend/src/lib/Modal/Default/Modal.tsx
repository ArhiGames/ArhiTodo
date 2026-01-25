import "./Modal.css"
import type { ReactNode } from "react";

export type modalSize = "modal-large" | "modal-medium" | "modal-s-medium" | "modal-small";

const Modal = (props: { header: ReactNode, children: ReactNode, footer: ReactNode, modalSize: modalSize, onClosed: () => void }) => {

    return (
        <div onClick={props.onClosed} className="modal-background">
            <div onClick={(e) => e.stopPropagation()} className={`${props.modalSize} modal-container`}>
                <div className="modal-header">
                    {props.header}
                    <button onClick={props.onClosed} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    { props.children }
                </div>
                <div className="modal-footer">
                    { props.footer }
                </div>
            </div>
        </div>
    )

}

export default Modal;