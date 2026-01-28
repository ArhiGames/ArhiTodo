using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.Services.Interfaces.Realtime;
using ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;
using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Services;

public class ProjectNotificationService(IHubContext<BoardHub, IBoardClient> hubContext) : IProjectNotificationService
{
    public void UpdateProject(ProjectGetDto projectGetDto)
    {
        hubContext.Clients.Group($"grp-project-{projectGetDto.ProjectId}").UpdateProject(projectGetDto);
    }
}