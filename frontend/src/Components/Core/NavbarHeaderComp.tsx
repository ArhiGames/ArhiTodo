import {Link, matchPath, useLocation} from "react-router-dom";
import LoggedInUserCardComp from "../User/Nav/LoggedInUserCardComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {Project} from "../../Models/States/types.ts";
import {useEffect, useState} from "react";
import EditProjectModalComp from "../Project/EditProject/EditProjectModalComp.tsx";
import "./Navbar.css"

const NavbarHeaderComp = () => {

    const { jwtPayload, appUser } = useAuth();
    const kanbanState = useKanbanState();
    const location = useLocation();
    const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
    const [isEditingProject, setIsEditingProject] = useState<boolean>(false);

    const projectId = match?.params.projectId;
    const project: Project | null = kanbanState.projects[Number(projectId)];

    function mayEditProject(): boolean {
        const mayModifyOthersProjectsGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[Number(projectId)]?.isManager;

        return !!(mayModifyOthersProjectsGlobally || isProjectManager);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsEditingProject(false);
    }, [location]);

    function getNavigationJsx() {

        if (!match || !projectId || !project) {
            return <Link to="/">ArhiTodo</Link>;
        }

        return (
            <div className="navbar-header-project-view">
                <Link to="/">
                    <img className="icon" style={{ height: "32px", marginRight: "1rem" }} src="/back-arrow.svg" alt="Back"/>
                </Link>
                <p>{project.projectName}</p>
                { mayEditProject() && (
                    <img className="icon clickable" onClick={() => setIsEditingProject(true)}
                         style={{ height: "20px" }} src="/edit-icon.svg" alt="Edit"/>
                )}
            </div>
        )

    }

    return (
        <nav className="navbar-header">
            { getNavigationJsx() }
            { appUser && <LoggedInUserCardComp appUser={appUser}/> }
            { isEditingProject && project && mayEditProject() && <EditProjectModalComp onClose={() => setIsEditingProject(false)} project={project}/> }
        </nav>
    )
}

export default NavbarHeaderComp;