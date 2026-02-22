import type {Project} from "../../../Models/States/KanbanState.ts";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import ProjectManagerCard from "./ProjectManagerCard.tsx";
import ProjectManagerAddComp from "./ProjectManagerAddComp.tsx";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";

interface Props {
    project: Project;
}

const EditProjectProjectManagersComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const permissions = usePermissions();

    const [projectManagers, setProjectManagers] = useState<UserGetDto[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return;

            fetch(`${API_BASE_URL}/project/${props.project.projectId}/managers/`, {
                method: "GET",
                headers: { "content-type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch project managers")
                    }

                    return res.json();
                })
                .then((projectManagers: UserGetDto[]) => {
                    setProjectManagers(projectManagers);
                })
                .catch(console.error)
                .finally(() => setLoaded(true));

        }
        run();

    }, [checkRefresh, props.project]);

    return (
        <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <h3>Managers</h3>
                { loaded && permissions.hasEditProjectManagerPermission() && <ProjectManagerAddComp projectManagers={projectManagers} setProjectManagers={setProjectManagers}/> }
            </div>
            <p>Project managers have full access to all project settings, boards, etc. However, project managers cannot delete the project</p>
            <div className="edit-project-modal-managers">
                {loaded && (
                        <>
                            {projectManagers.map((projectManager: UserGetDto) => {
                                return <ProjectManagerCard project={props.project} projectManager={projectManager} key={projectManager.userId}
                                                           projectManagers={projectManagers} setProjectManagers={setProjectManagers}
                                                           editable={permissions.hasEditProjectManagerPermission()} />
                            })}

                        </>
                    )}
            </div>
        </section>
    )

}

export default EditProjectProjectManagersComp;