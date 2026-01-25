import { useEffect, useState } from "react";
import "./NumberInput.css"

interface Props {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    numberForInfinite?: number;
    disabled?: boolean;
    allowDirectInput?: boolean;
    onChange: (value: number) => void;
}

const NumberInput = (props: Props) => {

    const [value, setValue] = useState<number>(props?.defaultValue ?? 0);

    useEffect(() => {

        props.onChange(value);

    }, [props, value]);

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

    function onInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
        let number = Number(e.target.value);
        if (!isNaN(number)) {
            if (props.min !== undefined && props.max !== undefined) {
                number = number < props.min ? props.min : number > props.max ? props.max : number;
            }
            else if (props.max !== undefined) {
                number = number > props.max ? props.max : number;
            }
            else if (props.min !== undefined) {
                number = number < props.min ? props.min : number;
            }
            setValue(number);
        }
    }

    return (
        <div className={ `${(props.disabled !== undefined && props.disabled) ? "nin-disabled" : null} nin-number-input` }>
            { props.allowDirectInput === undefined || props.allowDirectInput ? (
                <input value={ props.numberForInfinite !== undefined ? (value === props.numberForInfinite ? "" : value) : value }
                       placeholder="Infinity"
                       onChange={onInputChanged}/>
            ) : (
                <p>{props.numberForInfinite !== undefined ? (props.numberForInfinite === value ? "Infinite" : value) : value}</p>
            ) }
            <div>
                <button disabled={props.disabled} onClick={increase} className="nin-increase" type="button">+</button>
                <button disabled={props.disabled} onClick={decrease} className="nin-decrease" type="button">-</button>
            </div>
        </div>
    )

}

export default NumberInput;