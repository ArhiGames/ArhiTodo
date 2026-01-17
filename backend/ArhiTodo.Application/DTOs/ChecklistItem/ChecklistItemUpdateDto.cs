namespace ArhiTodo.Application.DTOs.ChecklistItem;

public record ChecklistItemUpdateDto(int ChecklistItemId, string ChecklistItemName, bool IsDone);