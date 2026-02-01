import type {Project} from "../../../Models/States/types.ts";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import ProjectManagerCard from "./ProjectManagerCard.tsx";

interface Props {
    project: Project;
}

const EditProjectProjectManagersComp = (props: Props) => {

    const { checkRefresh } = useAuth();

    const [projectManagers, setProjectManagers] = useState<UserGetDto[]>([]);

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
                .catch(console.error);

        }
        run();

    }, [checkRefresh, props.project]);

    return (
        <section>
            <h3>Managers</h3>
            <p>Project managers have full access to all project settings, boards, etc. However, project managers cannot delete the project</p>
            <div className="edit-project-modal-managers">
                {projectManagers.map((projectManager: UserGetDto) => {
                    return <ProjectManagerCard project={props.project} projectManager={projectManager}
                                               projectManagers={projectManagers} setProjectManagers={setProjectManagers}/>
                })}
            </div>
        </section>
    )

}

export default EditProjectProjectManagersComp;