import {useEffect, useRef, useState} from "react";
import DropdownChild from "./DropdownChild";
import "./Dropdown.css"

interface Props {
    defaultValue: string;
    values: string[];
    onChange: (val: string) => void;
}

const Dropdown = (props: Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<string>(props.defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        function handleClicked(e: MouseEvent) {

            e.stopPropagation();
            if (!dropdownRef.current) return;

            if (!dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClicked);

        return () => {
            document.removeEventListener("mousedown", handleClicked)
        }

    }, [props]);

    function onChange(val: string) {

        setCurrentValue(val);
        setIsOpen(false);
        props.onChange(val);

    }

    return (
        <div ref={dropdownRef} onClick={() => setIsOpen(!isOpen)} className="dropdown">
            <div style={ { display: "flex", alignItems: "center" } }>
                <p>{currentValue}</p>
                <p className={`dropdown-icon ${ isOpen ? "dropdown-flipped" : null }`}>V</p>
            </div>
            {
                isOpen && (
                    <div className="dropdown-childs">
                        { props.values.map((value: string, index: number) => (
                            <DropdownChild onChange={onChange} value={value} key={index}/>
                        )) }
                    </div>
                )
            }
        </div>
    )

}

export default Dropdown;