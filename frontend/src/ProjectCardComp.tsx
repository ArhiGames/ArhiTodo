import type {Project} from "./Models/Project.ts";
import {Link} from "react-router-dom";

const ProjectCardComp = (props: { project: Project } ) => {
    return (
        <Link to={`/projects/${props.project.projectId}`} className="project-card">
            <div >
                <h2>{props.project.projectName}</h2>
            </div>
        </Link>
    )
}

export default ProjectCardComp;