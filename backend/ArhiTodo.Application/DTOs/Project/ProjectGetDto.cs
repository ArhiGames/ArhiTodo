namespace ArhiTodo.Application.DTOs.Project;

public class ProjectGetDto
{
    public int ProjectId { get; set; }
    
    public required string ProjectName { get; set; }
}