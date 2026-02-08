using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Services.Interfaces.Kanban;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectGetDto = ArhiTodo.Application.DTOs.Project.ProjectGetDto;

namespace ArhiTodo.Controllers.Kanban;

[Authorize]
[ApiController]
[Route("api/project")]
public class ProjectController(IProjectService projectService) : ApiControllerBase
{
    [HttpPut("{projectId:int}/managers")]
    public async Task<IActionResult> UpdateProjectManagers(int projectId, [FromBody] List<ProjectManagerStatusUpdateDto> projectManagerStatusUpdateDtos)
    {
        Result<List<UserGetDto>> projectManagers = await projectService.UpdateProjectManagerStates(projectId, projectManagerStatusUpdateDtos);
        return projectManagers.IsSuccess ? Ok(projectManagers.Value) : HandleFailure(projectManagers);
    }

    [HttpDelete("{projectId:int}/managers/{userId:guid}")]
    public async Task<IActionResult> RemoveManager(int projectId, Guid userId)
    {
        Result removeProjectManagerResult = await projectService.RemoveProjectManager(projectId, userId);
        return removeProjectManagerResult.IsSuccess ? NoContent() : HandleFailure(removeProjectManagerResult);
    }

    [HttpGet("{projectId:int}/managers")]
    public async Task<IActionResult> GetProjectManagers(int projectId)
    {
        Result<List<UserGetDto>> projectManagers = await projectService.GetProjectManagers(projectId);
        return projectManagers.IsSuccess ? Ok(projectManagers.Value) : HandleFailure(projectManagers);
    }
    
    [Authorize(Policy = nameof(UserClaimTypes.CreateProjects))]
    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto projectCreateDto)
    {
        Result<ProjectGetDto> project = await projectService.CreateProject(projectCreateDto);
        return project.IsSuccess ? Ok(project.Value) : HandleFailure(project);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProject([FromBody] ProjectUpdateDto projectUpdateDto)
    {
        Result<ProjectGetDto> project = await projectService.UpdateProject(projectUpdateDto);
        return project.IsSuccess ? Ok(project.Value) : HandleFailure(project);
    }

    [HttpDelete("{projectId:int}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        Result deleteProjectResult = await projectService.DeleteProject(projectId);
        return deleteProjectResult.IsSuccess ? NoContent() : HandleFailure(deleteProjectResult);
    }

    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        Result<ProjectGetDto> projectGetDto = await projectService.GetProject(projectId);
        return projectGetDto.IsSuccess ? Ok(projectGetDto.Value) : HandleFailure(projectGetDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        Result<List<ProjectGetDto>> projects = await projectService.GetProjects();
        return projects.IsSuccess ? Ok(projects.Value) : HandleFailure(projects);
    }
}