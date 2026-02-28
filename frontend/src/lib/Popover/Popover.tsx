import { type ReactNode, type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Popover.css"

interface PopoverProps {
    element: RefObject<HTMLElement | null>;
    triggerElement: RefObject<HTMLElement | null>;
    children: ReactNode;
    close: (e: MouseEvent) => void;
    offsetX?: number;
    offsetY?: number;
}

const Popover = ( { element, triggerElement, children, close, offsetX = 0, offsetY = 0 }: PopoverProps ) => {

    const [position, setPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClicked(e: MouseEvent) {
            if (!popoverRef.current || !triggerElement.current) return;

            const target = e.target as Node;
            if (triggerElement.current.contains(target)) {
                return;
            }

            if (!popoverRef.current.contains(target)) {
                close(e);
            }
        }

        document.addEventListener("mouseup", handleClicked);
        return () => document.removeEventListener("mouseup", handleClicked);
    }, [close, triggerElement, popoverRef]);

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