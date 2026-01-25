import {useEffect, useRef, useState} from "react";
import DropdownChild from "./DropdownChild";
import "./Dropdown.css"
import {createPortal} from "react-dom";

interface Props {
    defaultValue: string;
    values: string[];
    onChange: (val: string) => void;
}

const Dropdown = (props: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<string>(props.defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownChildsRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {

        function handleClicked(e: MouseEvent) {

            e.stopPropagation();
            if (!dropdownRef.current || !dropdownChildsRef.current) return;

            if (!dropdownRef.current.contains(e.target as Node) && !dropdownChildsRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }

        }

        document.addEventListener("click", handleClicked);

        return () => document.removeEventListener("click", handleClicked);

    }, [props]);

    function onChange(val: string) {

        setCurrentValue(val);
        setIsOpen(false);
        props.onChange(val);

    }

    const updateCoords = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    const toggleDropdown = () => {
        if (!isOpen) updateCoords();
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} onClick={toggleDropdown} className="dropdown">
            <div className="dropdown-selector">
                <p>{currentValue}</p>
                <img src="/dropdown-icon.svg" alt="V" height="20px" className={`dropdown-icon ${ isOpen ? "dropdown-flipped" : null }`}/>
            </div>
            {
                isOpen && (
                    createPortal(
                        <div ref={dropdownChildsRef}
                            className="dropdown-childs"
                            style={{
                                position: 'absolute',
                                top: coords.top,
                                left: coords.left,
                                width: coords.width,
                                zIndex: 9999
                            }}>
                            {props.values.map((value, index) => (
                                <DropdownChild key={index} value={value} onChange={onChange} />
                            ))}
                        </div>, document.body)
                )
            }
        </div>
    )

}

export default Dropdown;