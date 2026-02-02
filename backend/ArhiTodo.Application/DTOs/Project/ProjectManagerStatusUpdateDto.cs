namespace ArhiTodo.Application.DTOs.Project;

public record ProjectManagerStatusUpdateDto(Guid UserId, bool NewManagerState);