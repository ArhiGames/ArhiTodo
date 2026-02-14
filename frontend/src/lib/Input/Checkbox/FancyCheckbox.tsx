import "./FancyCheckbox.css"

interface Props {
    value: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const FancyCheckbox = ({ value, onChange, disabled }: Props) => {

    function handleCheckboxClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
        if (disabled) return;
        onChange(!value);
    }

    return (
        <div onClick={handleCheckboxClick} className={`fancy-checkbox-div ${disabled ? "disabled" : ""}`}>
            <p className={`fancy-checkbox ${value ? "visible" : "invisible"}`}>✓</p>
        </div>
    )

}

export default FancyCheckbox;