using ArhiTodo.Infrastructure.Realtime.Hubs.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ArhiTodo.Infrastructure.Realtime.Hubs.Implementation;

[Authorize]
public class BoardHub : Hub<IBoardClient>
{
    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "test");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinProjectGroup(int projectId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"grp-project-{projectId}");
    }

    public async Task LeaveProjectGroup(int projectId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"grp-project-{projectId}");
    }
    
    public async Task JoinBoardGroup(int boardId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"grp-board-{boardId}");
    }

    public async Task LeaveBoardGroup(int boardId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"grp-board-{boardId}");
    }
}