namespace ArhiTodo.Application.DTOs.Board;

public record BoardMemberStatusUpdateDto(Guid UserId, bool NewMemberState);