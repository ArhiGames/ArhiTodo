import {useEffect, useState} from "react";
import type {Project} from "../../Models/Project.ts";
import ProjectCardComp from "../Project/ProjectCardComp.tsx";
import CreateNewProjectCardComp from "../Project/CreateNewProjectCardComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";

const HomePageComp = () => {

    const { token, checkRefresh } = useAuth();
    const [projects, setProjects] = useState<Project[]>();

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
                .then((fetchedProjects: Project[]) => {
                    setProjects(fetchedProjects);
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

    }, [checkRefresh, token]);

    return (
        <div className="projects-container">
            {projects?.map((project: Project) => {
                return (
                    <ProjectCardComp key={project.projectId} project={project}/>
                )
            })}
            <CreateNewProjectCardComp/>
        </div>
    )
}

export default HomePageComp;