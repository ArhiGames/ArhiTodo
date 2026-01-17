import "./FancyCheckbox.css"

interface Props {
    value: boolean;
    onChange: (checked: boolean) => void;
}

const FancyCheckbox = ({ value, onChange }: Props) => {

    function handleCheckboxClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
        const newValue = !value;
        onChange(newValue);
    }

    return (
        <div onClick={handleCheckboxClick} className="fancy-checkbox-div">
            <p className={`fancy-checkbox ${value ? "visible" : "invisible"}`}>✓</p>
        </div>
    )

}

export default FancyCheckbox;