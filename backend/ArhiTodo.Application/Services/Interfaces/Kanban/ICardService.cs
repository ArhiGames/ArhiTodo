using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Domain.Common.Result;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Application.Services.Interfaces.Kanban;

public interface ICardService
{
    Task<Result<CardGetDto>> CreateCard(int boardId, int cardListId, CardCreateDto cardCreateDto);
    Task<Result> DeleteCard(int projectId, int boardId, int cardId);
    Task<Result<CardGetDto>> PatchCardName(int boardId, int cardId, PatchCardNameDto patchCardNameDto);
    Task<Result<CardGetDto>> PatchCardStatus(int boardId, int cardId, bool isDone);
    Task<Result<CardGetDto>> PatchCardDescription(int cardId, PatchCardDescriptionDto patchCardDescriptionDto);
    Task<Result<CardGetDto>> GetCard(int cardId);
}