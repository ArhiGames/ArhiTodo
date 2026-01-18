using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectGetDto = ArhiTodo.Application.DTOs.Project.ProjectGetDto;

namespace ArhiTodo.Controllers;

[Authorize]
[ApiController]
[Route("api/project")]
public class ProjectController(IProjectService projectService) : ControllerBase
{
    [HttpPost]
    // @Todo
    //[Authorize(Policy = "CreateProjects")]
    public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto projectCreateDto)
    {
        ProjectGetDto project = await projectService.CreateProject(projectCreateDto);
        return Ok(project);
    }

    [HttpDelete("{projectId:int}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        bool success = await projectService.DeleteProject(projectId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        List<ProjectGetDto> projects = await projectService.GetProjects();
        return Ok(projects);
    }
}