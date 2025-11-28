using ArhiTodo.DataBase;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectController : ControllerBase
{
    private readonly ProjectDataBase _project;

    public ProjectController(ProjectDataBase project)
    {
        _project = project;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectPostDto projectPostDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Project newProject = new()
        {
            ProjectName = projectPostDto.ProjectName,
        };

        _project.Projects.Add(newProject);
        await _project.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteProject(int id)
    {
        Project? project = await _project.Projects.FirstOrDefaultAsync((Project p) => p.ProjectId == id);
        if (project == null) return NotFound();

        _project.Projects.Remove(project);
        await _project.SaveChangesAsync();
        
        return Ok();
    }
}