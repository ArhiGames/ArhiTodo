import "./FancyToggleComp.css"

const FancyToggleComp = (props: { checked: boolean, setChecked: (value: boolean) => void }) => {

    function switchState() {

        props.setChecked(!props.checked);

    }

    return (
        <div onClick={switchState} className="fancy-toggle-background">
            <div className={`fancy-toggle${props.checked ? "-checked" : ""}`}/>
        </div>
    )

}

export default FancyToggleComp;