import {useEffect} from "react";
import ProjectCardComp from "../Project/ProjectCardComp.tsx";
import CreateNewProjectCardComp from "../Project/CreateNewProjectCardComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {Project} from "../../Models/States/types.ts";
import type {ProjectGetDto} from "../../Models/BackendDtos/Kanban/ProjectGetDto.ts";

const HomePageComp = () => {

    const { token, jwtPayload, checkRefresh } = useAuth();
    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();

    useEffect(() => {

        const abortController = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/project`,
                {
                    method: 'GET',
                    headers: { "Authorization": `Bearer ${refreshedToken}` },
                    signal: abortController.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch projects');
                    }

                    return res.json();
                })
                .then((fetchedProjects: ProjectGetDto[]) => {
                    if (dispatch) {
                        dispatch({type: "INIT_PROJECTS", payload: fetchedProjects});
                    }
                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }
                    console.error(err);
                });
        }

        run();

        return () => abortController.abort();

    }, [checkRefresh, dispatch, token]);

    return (
        <div className="projects-container">
            {Object.values(kanbanState.projects).map((project: Project) => {
                return (
                    <ProjectCardComp key={project.projectId} project={project}/>
                )
            })}
            { jwtPayload?.CreateProjects === "true" && <CreateNewProjectCardComp/> }
        </div>
    )
}

export default HomePageComp;