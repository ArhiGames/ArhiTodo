import {type ReactNode, type RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
    element: RefObject<HTMLElement | null>;
    children: ReactNode;
    close: () => void;
    closeIfClickedOutside?: boolean;
    offsetX?: number;
    offsetY?: number;
}

const Popover = ( { element, children, close, closeIfClickedOutside = true, offsetX = 0, offsetY = 0 }: PopoverProps ) => {

    const [position, setPosition] = useState({top: 0, left: 0});
    const popoverRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (!closeIfClickedOutside) return;

        function handleClicked(e: MouseEvent) {

            e.stopPropagation();
            if (!popoverRef.current) return;

            if (!popoverRef.current.contains(e.target as Node)) {
                close();
            }

        }

        document.addEventListener("mousedown", handleClicked);

        return () => {
            document.removeEventListener("mousedown", handleClicked)
        }

    }, [close, closeIfClickedOutside]);

    useLayoutEffect(() => {

        function updatePosition() {

            if (!element.current || !popoverRef.current) return;

            const targetRect = element.current.getBoundingClientRect();
            const popoverRect = popoverRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = targetRect.bottom + offsetY;
            let left = targetRect.left + offsetX;

            if (top + popoverRect.height > viewportHeight) {
                top = targetRect.top - popoverRect.height - offsetY;
            }

            if (left + popoverRect.width > viewportWidth) {
                left = viewportWidth - popoverRect.width + offsetX;
            }

            if (left < 0) left = 5;

            setPosition({top: top, left: left});

        }

        updatePosition();

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
        }

    }, [element, offsetX, offsetY]);

    return createPortal(
        <div ref={popoverRef} className="popover" style={{ position: "fixed", top: position.top, left: position.left, zIndex: 9999 }}>
            {children}
        </div>, document.body
    )

}

export default Popover;