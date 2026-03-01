using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Services.Interfaces.Authentication;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class ProjectNotificationService(IHubContext<BoardHub, IBoardClient> hubContext, ICurrentUser currentUser) : IProjectNotificationService
{
    public void UpdateProject(ProjectGetDto projectGetDto)
    {
        hubContext.Clients.GroupExcept($"grp-project-{projectGetDto.ProjectId}", currentUser.ConnectionId ?? "").UpdateProject(projectGetDto);
    }

    public void DeleteProject(int projectId)
    {
        hubContext.Clients.GroupExcept($"grp-project-{projectId}", currentUser.ConnectionId ?? "").DeleteProject(projectId);
    }

    public void UpdateProjectManagerState(Guid userId, int projectId, bool isManager)
    {
        hubContext.Clients.User(userId.ToString()).UpdateProjectManager(projectId, isManager);
    }
}