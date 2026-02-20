using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Helpers;

namespace ArhiTodo.Domain.Entities.Kanban;

public class Draggable
{
    public string Position { get; private set; }

    protected Draggable(string position)
    {
        Position = position;
    }

    protected Result Move(string? prevLocation, string? nextLocation)
    {
        string newLocation = LexicalOrderHelper.GetBetween(prevLocation, nextLocation);
        Position = newLocation;
        return Result.Success();
    }    
}