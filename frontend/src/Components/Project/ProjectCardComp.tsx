import { Link } from "react-router-dom";
import type {Project} from "../../Models/States/types.ts";

const ProjectCardComp = (props: { project: Project } ) => {

    return (
        <Link to={`/projects/${props.project.projectId}/board`} className="project-card">
            <div>
                <h2>{props.project.projectName}</h2>
            </div>
        </Link>
    )
}

export default ProjectCardComp;