import type {Project, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import ProjectManagerCard from "./ProjectManagerCard.tsx";
import ProjectManagerAddComp from "./ProjectManagerAddComp.tsx";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {useKanbanDispatch} from "../../../Contexts/Kanban/Hooks.ts";

interface Props {
    project: Project;
}

const EditProjectProjectManagersComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const permissions = usePermissions();
    const dispatch = useKanbanDispatch();

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return;

            fetch(`${API_BASE_URL}/project/${props.project.projectId}/managers/public`, {
                method: "GET",
                headers: { "content-type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch project managers")
                    }

                    return res.json();
                })
                .then((projectManagers: PublicUserGetDto[]) => {
                    if (dispatch) {
                        dispatch({ type: "INIT_PROJECT_MANAGERS", payload: { projectId: props.project.projectId, projectManagers: projectManagers }});
                    }
                })
                .catch(console.error)
                .finally(() => setLoaded(true));

        }
        run();

    }, []);

    return (
        <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <h3>Managers</h3>
                { loaded && permissions.hasEditProjectManagerPermission() && <ProjectManagerAddComp project={props.project}/> }
            </div>
            <p>Project managers have full access to all project settings, boards, etc. However, project managers cannot delete the project</p>
            <div className="edit-project-modal-managers">
                {loaded && (
                        <>
                            {props.project.projectManagers.map((projectManager: PublicUserGetDto) => {
                                return <ProjectManagerCard project={props.project} projectManager={projectManager} key={projectManager.userId}
                                                           editable={permissions.hasEditProjectManagerPermission()} />
                            })}
                        </>
                    )}
            </div>
        </section>
    )

}

export default EditProjectProjectManagersComp;