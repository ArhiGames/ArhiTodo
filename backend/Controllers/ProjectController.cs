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
            
            ProjectGetDto projectGetDto = new()
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                Boards = project.Boards.Select(b => new BoardGetDto
                {
                    BoardId = b.BoardId,
                    BoardName = b.BoardName,
                    CardLists = b.CardLists.Select(cl => new CardListGetDto
                    {
                        CardListId = cl.CardListId,
                        CardListName = cl.CardListName,
                        Cards = cl.Cards.Select(c => new CardGetDto
                        {
                            CardId = c.CardId,
                            CardName = c.CardName
                        }).ToList()
                    }).ToList()
                }).ToList()
            };
            
            return Ok(projectGetDto);
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }
}