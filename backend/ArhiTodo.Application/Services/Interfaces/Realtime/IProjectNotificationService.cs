using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;

namespace ArhiTodo.Application.Services.Interfaces.Realtime;

public interface IProjectNotificationService
{
    void UpdateProject(ProjectGetDto projectGetDto);
    void DeleteProject(int projectId);
    void AddProjectManager(int projectId, PublicUserGetDto publicUserGetDto);
    void RemoveProjectManager(int projectId, Guid projectManagerId);
}