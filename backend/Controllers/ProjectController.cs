using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using ArhiTodo.Services;
using Microsoft.AspNetCore.Mvc;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectController : ControllerBase
{
    private  readonly ProjectService _projectService;
    
    public ProjectController(ProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectPostDto projectPostDto)
    {
        await _projectService.CreateProject(projectPostDto);

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProject(int id)
    {
        bool success = await _projectService.DeleteProject(id);
        if (!success) return NotFound();

        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        List<Project> projects = await _projectService.GetAllProjects();
        return Ok(projects);
    }
}