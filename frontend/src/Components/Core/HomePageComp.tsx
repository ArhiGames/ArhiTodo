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

        const run = async () => {
            const succeeded = await checkRefresh();
            if (!succeeded) return;

            fetch(`${API_BASE_URL}/project`,
                {
                    method: 'GET',
                    headers: { "Authorization": `Bearer ${token}` }
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
                .catch(console.error);
        }

        run();

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