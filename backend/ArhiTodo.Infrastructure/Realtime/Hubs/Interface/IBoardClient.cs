using ArhiTodo.Application.DTOs.Project;
using ArhiTodo.Domain.Entities.DTOs;

namespace ArhiTodo.Infrastructure.Realtime.Hubs.Interface;

public interface IBoardClient
{
    Task UpdateProject(ProjectGetDto projectGetDto);
    Task DeleteProject(int projectId);
    
    Task CreateBoard(int projectId, BoardGetDto board);
    Task UpdateBoard(int projectId, BoardGetDto board);
    Task DeleteBoard(int boardId);

    Task CreateCardList(int boardId, CardListGetDto cardList);
    Task UpdateCardList(int boardId, CardListGetDto cardList);
    Task DeleteCardsFromCardList(int cardListId);
    Task DeleteCardList(int cardListId);
    
    Task CreateCard(int boardId, int cardListId, CardGetDto card);
    Task DeleteCard(int cardId);
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