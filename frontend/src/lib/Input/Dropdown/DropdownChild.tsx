interface Props {
    value: string;
    onChange: (value: string) => void;
}

const DropdownChild = (props: Props) => {

    return (
        <div onClick={() => props.onChange(props.value)} className="dropdown-child">
            <p>{props.value}</p>
        </div>
    )

}

export default DropdownChild;