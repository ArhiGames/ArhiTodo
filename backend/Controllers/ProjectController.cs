using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/project")]
public class ProjectController : ControllerBase
{
    private readonly ProjectService _projectService;
    
    public ProjectController(ProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectPostDto projectPostDto)
    {
        Project project = await _projectService.CreateProject(projectPostDto);

        return CreatedAtAction(nameof(GetProject), new { projectId = project.ProjectId }, project.ToGetDto());
    }

    [HttpDelete("{projectId:int}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        bool success = await _projectService.DeleteProject(projectId);
        if (!success) return NotFound();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        List<Project> projects = await _projectService.GetAllProjects();
        return Ok(projects);
    }

    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        try
        {
            Project? project = await _projectService.GetProject(projectId);
            if (project == null) return NotFound();

            ProjectGetDto projectGetDto = project.ToGetDto();
            return Ok(projectGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}