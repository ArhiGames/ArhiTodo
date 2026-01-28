import {Link, matchPath, useLocation} from "react-router-dom";
import LoggedInUserCardComp from "../User/LoggedInUserCardComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {Project} from "../../Models/States/types.ts";
import {useState} from "react";
import EditProjectModalComp from "../Project/EditProjectModalComp.tsx";

const NavbarHeaderComp = () => {

    const { appUser } = useAuth();
    const kanbanState = useKanbanState();
    const location = useLocation();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId" }, location.pathname);
    const [isEditingProject, setIsEditingProject] = useState<boolean>(false);

    const projectId = match?.params.projectId;
    const project: Project | null = kanbanState.projects[Number(projectId)];

    function getNavigationJsx() {

        if (!match || !projectId || !project) {
            return <Link to="/">ArhiTodo</Link>;
        }

        return (
            <div className="navbar-header-project-view">
                <Link to="/">
                    <img style={{ height: "32px", marginRight: "1rem" }} src="/public/back-arrow.svg" alt="Back"/>
                </Link>
                <p>{project.projectName}</p>
                <img onClick={() => setIsEditingProject(true)} style={{ height: "20px" }} src="/public/edit-icon.svg" alt="Edit"/>
            </div>
        )

    }

    return (
        <nav className="navbar-header">
            { getNavigationJsx() }
            { appUser && <LoggedInUserCardComp appUser={appUser}/> }
            { isEditingProject && project && <EditProjectModalComp onClose={() => setIsEditingProject(false)} project={project}/> }
        </nav>
    )
}

export default NavbarHeaderComp;