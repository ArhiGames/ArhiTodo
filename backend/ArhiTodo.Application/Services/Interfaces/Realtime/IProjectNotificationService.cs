using ArhiTodo.Application.DTOs.Project;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IProjectNotificationService
{
    void UpdateProject(ProjectGetDto projectGetDto);
}