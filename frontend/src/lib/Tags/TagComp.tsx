import "./TagComp.css"

interface Props {
    tag: string;
    color: "red" | "green" | "orange" | "blue" | "gray";
}

const TagComp = ( { tag, color }: Props ) => {

    return (
        <div className="tag" style={{ backgroundColor: `var(--tag-${color})` }}>
            <p>{tag}</p>
        </div>
    )

}

export default TagComp;