using ArhiTodo.Application.DTOs.Project;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IProjectNotificationService
{
    void UpdateProject(ProjectGetDto projectGetDto);
    void DeleteProject(int projectId);
    void UpdateProjectManagerState(Guid userId, int projectId, bool isManager);
}