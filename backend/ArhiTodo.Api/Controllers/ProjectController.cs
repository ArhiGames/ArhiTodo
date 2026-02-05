using ArhiTodo.Application.DTOs.Auth;
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
    [HttpPut("{projectId:int}/managers")]
    public async Task<IActionResult> UpdateProjectManagers(int projectId, [FromBody] List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos)
    {
        List<UserGetDto>? projectManagers = await projectService.UpdateProjectManagerStates(projectId, projectManagerStatusUpdateDtos);
        if (projectManagers == null) return NotFound();
        return Ok(projectManagers);
    }

    [HttpDelete("{projectId:int}/managers/{userId:guid}")]
    public async Task<IActionResult> RemoveManager(int projectId, Guid userId)
    {
        bool succeeded = await projectService.RemoveProjectManager(projectId, userId);
        if (!succeeded) return NotFound();
        return NoContent();
    }

    [HttpGet("{projectId:int}/managers")]
    public async Task<IActionResult> GetProjectManagers(int projectId)
    {
        List<UserGetDto>? projectManagers = await projectService.GetProjectManagers(projectId);
        if (projectManagers == null) return NotFound();
        return Ok(projectManagers);
    }
    
    [HttpPost]
    // @Todo
    //[Authorize(Policy = "CreateProjects")]
    public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto projectCreateDto)
    {
        ProjectGetDto? project = await projectService.CreateProject(projectCreateDto);
        if (project == null) return NotFound();
        return Ok(project);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProject([FromBody] ProjectUpdateDto projectUpdateDto)
    {
        ProjectGetDto? project = await projectService.UpdateProject(projectUpdateDto);
        if (project == null) return NotFound();
        return Ok(project);
    }

    [HttpDelete("{projectId:int}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        bool success = await projectService.DeleteProject(projectId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        ProjectGetDto? projectGetDto = await projectService.GetProject(projectId);
        if (projectGetDto == null) return NotFound();
        return Ok(projectGetDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        List<ProjectGetDto> projects = await projectService.GetProjects();
        return Ok(projects);
    }
}