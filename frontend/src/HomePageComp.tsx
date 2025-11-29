import { useEffect, useState } from "react";
import type { Project } from "./Models/Project.ts";
import ProjectCardComp from "./ProjectCardComp.tsx";

const HomePageComp = () => {
    const [projects, setProjects] = useState<Project[]>();

    useEffect(() => {

        fetch('https://localhost:7069/api/project', { method: 'GET' })
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

    }, []);

    return (
        <div className="projects-container">
            {projects?.map((project: Project) => {
                return (
                    <ProjectCardComp key={project.projectId} project={project}/>
                )
            })}
        </div>
    )
}

export default HomePageComp;