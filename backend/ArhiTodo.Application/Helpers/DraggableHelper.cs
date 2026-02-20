using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Helpers;

public static class DraggableHelper
{
    public static (string? prevLocation, string? nextLocation) GetPrevNextLocation(List<Draggable> existingDraggables, 
        Draggable draggingDraggable, int newLocation, bool isDifferentContainer = false)
    {
        existingDraggables = existingDraggables.OrderBy(ed => ed.Position).ToList();
        
        bool movedDown;
        if (isDifferentContainer) movedDown = false;
        else
        {
            int index = 0;
            for (int i = 0; i < existingDraggables.Count; i++)
            {
                if (draggingDraggable.Position != existingDraggables[i].Position) continue;
                index = i;
                break;
            }
            movedDown = index < newLocation && existingDraggables.Count != newLocation;
        }
        
        string? prevLocation = newLocation == 0 ? null : existingDraggables[movedDown ? newLocation : newLocation - 1].Position;
        int nextLocationIndex = movedDown ? newLocation + 1 : newLocation;
        string? nextLocation = existingDraggables.Count > nextLocationIndex ? existingDraggables[nextLocationIndex].Position : null;
        return (prevLocation, nextLocation);
    }
}