import { Link } from "react-router-dom";
import type {Project} from "../../Models/States/KanbanState.ts";
import "./ProjectCreator.css"

const ProjectCardComp = (props: { project: Project } ) => {

    return (
        <Link to={`/projects/${props.project.projectId}/board`} className="project-card">
            <span>{props.project.projectName}</span>
        </Link>
    )
}

export default ProjectCardComp;