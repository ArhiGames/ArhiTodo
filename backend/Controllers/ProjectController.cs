using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("api/project")]
public class ProjectController : ControllerBase
{
    private readonly IProjectRepository _projectRepository;
    
    public ProjectController(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectPostDto projectPostDto)
    {
        Project project = await _projectRepository.CreateAsync(projectPostDto);

        return CreatedAtAction(nameof(GetProject), new { projectId = project.ProjectId }, project.ToGetDto());
    }

    [HttpDelete("{projectId:int}")]
    public async Task<IActionResult> DeleteProject(int projectId)
    {
        bool success = await _projectRepository.DeleteAsync(projectId);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        List<Project> projects = await _projectRepository.GetAllAsync();
        return Ok(projects);
    }

    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> GetProject(int projectId)
    {
        try
        {
            Project? project = await _projectRepository.GetAsync(projectId);
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