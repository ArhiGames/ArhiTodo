import {Link, matchPath, useLocation} from "react-router-dom";
import LoggedInUserCardComp from "../User/LoggedInUserCardComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {Project} from "../../Models/States/types.ts";

const NavbarHeaderComp = () => {

    const { appUser } = useAuth();
    const kanbanState = useKanbanState();
    const location = useLocation();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId" }, location.pathname);

    function getNavigationJsx() {

        if (!match) {
            return <Link to="/">ArhiTodo</Link>;
        }

        const projectId = match.params.projectId;
        if (!projectId) {
            return <Link to="/">ArhiTodo</Link>;
        }

        const project: Project | null = kanbanState.projects[Number(projectId)];
        if (!project) {
            return <Link to="/">ArhiTodo</Link>;
        }

        return (
            <div className="navbar-header-project-view">
                <Link to="/">
                    <img style={{ height: "32px", marginRight: "1rem" }} src="/public/back-arrow.svg" alt="Back"/>
                </Link>
                <p>{project.projectName}</p>
                <img style={{ height: "20px" }} src="/public/edit-icon.svg" alt="Edit"/>
            </div>
        )

    }

    return (
        <nav className="navbar-header">
            {getNavigationJsx()}
            { appUser ? <LoggedInUserCardComp appUser={appUser}/> : null }
        </nav>
    )
}

export default NavbarHeaderComp;