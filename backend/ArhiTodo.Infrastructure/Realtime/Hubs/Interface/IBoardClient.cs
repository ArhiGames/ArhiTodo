using ArhiTodo.Application.DTOs.Auth;
using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Application.DTOs.User;
using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Infrastructure.Realtime.Hubs.Interface;

public interface IBoardClient
{
    Task UpdateProject(ProjectGetDto projectGetDto);
    Task DeleteProject(int projectId);
    Task UpdateProjectManager(int projectId, bool isManager);
    
    Task CreateBoard(int projectId, BoardGetDto board);
    Task UpdateBoard(int projectId, BoardGetDto board);
    Task DeleteBoard(int boardId);
    Task AddBoardMember(int boardId, PublicUserGetDto publicUserGetDto);
    Task RemoveBoardMember(int boardId, Guid userId);
    Task UpdateUserBoardPermissions(int boardId, List<ClaimGetDto> claimGetDtos);

    Task CreateCardList(int boardId, CardListGetDto cardList);
    Task UpdateCardList(int boardId, CardListGetDto cardList);
    Task MoveCardList(int cardListId, int toIndex);
    Task DeleteCardsFromCardList(int cardListId);
    Task DeleteCardList(int cardListId);
    
    Task CreateCard(int boardId, int cardListId, CardGetDto card);
    Task DeleteCard(int cardId);
    Task UpdateCardUrgencyLevel(int cardId, CardUrgencyLevel cardUrgencyLevel);
    Task MoveCard(int cardId, int toCardListId, int toIndex);
    Task AssignUser(int cardId, Guid userId);
    Task RemoveAssignedUser(int cardId, Guid userId);
    Task PatchCardName(int cardId, CardGetDto card);
    Task PathCardStatus(int cardId, bool isDone);
    
    Task CreateChecklist(int cardId, ChecklistGetDto checklistGetDto);
    Task UpdateChecklist(int cardId, ChecklistGetDto checklistGetDto);
    Task DeleteChecklist(int checklistId);
    Task CreateChecklistItemOnChecklist(int checklistId, ChecklistItemGetDto checklistItemGetDto);
    Task UpdateChecklistItem(int checklistId, ChecklistItemGetDto checklistItemGetDto);
    Task PatchChecklistItemDoneState(int checklistItemId, bool taskDone);
    Task DeleteChecklistItemFromChecklist(int checklistItemId);

    Task CreateLabel(int boardId, LabelGetDto labelGetDto);
    Task UpdateLabel(int boardId, LabelGetDto labelGetDto);
    Task DeleteLabel(int labelId);
    Task AddLabelToCard(int cardId, int labelId);
    Task RemoveLabelFromCard(int cardId, int labelId);
}