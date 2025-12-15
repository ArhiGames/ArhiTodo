import { useState } from "react";
import "./NumberInput.css"

interface Props {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    numberForInfinite?: number;
    onChange?: (value: number) => void;
}

const NumberInput = (props: Props) => {

    const [value, setValue] = useState<number>(props?.defaultValue ?? 0);

    function increase() {

        const valueToAdd: number = (props?.step ?? 1);
        if (props.max !== undefined) {
            if (value + valueToAdd >= props.max) {
                setValue(props.max);
            } else {
                setValue(value + valueToAdd);
            }
        }

    }

    function decrease() {

        const valueToSubtract: number = (props?.step ?? 1);
        if (props.min !== undefined) {
            if (value - valueToSubtract <= props.min) {
                setValue(props.min);
            } else {
                setValue(value - valueToSubtract);
            }
        }

    }

    return (
        <div className="nin-number-input">
            <p>{props.numberForInfinite !== undefined ? (props.numberForInfinite == value ? "Infinite" : value) : value}</p>
            <div>
                <button onClick={increase} className="nin-increase" type="button">+</button>
                <button onClick={decrease} className="nin-decrease" type="button">-</button>
            </div>
        </div>
    )

}

export default NumberInput;