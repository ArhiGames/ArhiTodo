import { useEffect, useState } from "react";
import type { Project } from "../../Models/Project.ts";
import ProjectCardComp from "../Project/ProjectCardComp.tsx";
import CreateNewProjectCardComp from "../Project/CreateNewProjectCardComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";

const HomePageComp = () => {

    const { token } = useAuth();
    const [projects, setProjects] = useState<Project[]>();

    useEffect(() => {

        fetch('https://localhost:7069/api/project',
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

    }, [token]);

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