using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Domain.Common.Result;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ICardService
{
    Task<Result<CardGetDto>> CreateCard(int boardId, int cardListId, CardCreateDto cardCreateDto);
    Task<bool> DeleteCard(int projectId, int boardId, int cardId);
    Task<Result<CardGetDto>> PatchCardName(int boardId, int cardId, PatchCardNameDto patchCardNameDto);
    Task<CardGetDto?> PatchCardStatus(int boardId, int cardId, bool isDone);
    Task<CardGetDto?> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto);
    Task<CardGetDto?> GetCard(int cardId);
}