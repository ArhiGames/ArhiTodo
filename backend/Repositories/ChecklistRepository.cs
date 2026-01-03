using ArhiTodo.Data;
using ArhiTodo.Interfaces;
using ArhiTodo.Mappers;
using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Post;
using Microsoft.EntityFrameworkCore;

namespace ArhiTodo.Repositories;

public class ChecklistRepository : IChecklistRepository
{
    private readonly ProjectDataBase _dataBase;

    public ChecklistRepository(ProjectDataBase dataBase)
    {
        _dataBase = dataBase;
    }

    public async Task<Checklist?> CreateChecklistOnCard(int cardId, ChecklistPostDto checklistPostDto)
    {
        Card? card = await _dataBase.Cards.FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return null;
        }

        Checklist checklist = checklistPostDto.FromChecklistPostDto();
        card.Checklists.Add(checklist);
        await _dataBase.SaveChangesAsync();
        return checklist;
    }

    public async Task<bool> DeleteChecklistFromCard(int cardId, int checkListId)
    {
        Card? card = await _dataBase.Cards
            .Include(c => c.Checklists)
            .FirstOrDefaultAsync(c => c.CardId == cardId);
        if (card == null)
        {
            return false;
        }

        Checklist? checklist = card.Checklists.FirstOrDefault(cl => cl.ChecklistId == checkListId);
        if (checklist == null)
        {
            return false;
        }

        bool removed = card.Checklists.Remove(checklist);
        await _dataBase.SaveChangesAsync();
        return removed;
    }

    public async Task<ChecklistItem?> AddChecklistItemToChecklist(int checklistId, ChecklistItemPostDto checklistItemPostDto)
    {
        Checklist? checklist = await _dataBase.Checklists
            .Include(cl => cl.ChecklistItems)
            .FirstOrDefaultAsync(cl => cl.ChecklistId == checklistId);
        if (checklist == null)
        {
            return null;
        }

        ChecklistItem checklistItem = checklistItemPostDto.FromChecklistItemPostDto();
        checklist.ChecklistItems.Add(checklistItem);
        await _dataBase.SaveChangesAsync();
        return checklistItem;
    }

    public async Task<bool> RemoveChecklistItemFromChecklist(int checklistId, int checklistItemId)
    {
        Checklist? checklist = await _dataBase.Checklists
            .Include(cl => cl.ChecklistItems)
            .FirstOrDefaultAsync(cl => cl.ChecklistId == checklistId);
        if (checklist == null)
        {
            return false;
        }

        ChecklistItem? checklistItem = checklist.ChecklistItems.FirstOrDefault(cl => cl.ChecklistItemId == checklistItemId);
        if (checklistItem == null)
        {
            return false;
        }

        bool removed = checklist.ChecklistItems.Remove(checklistItem);
        await _dataBase.SaveChangesAsync();
        return removed;
    }

    public async Task<ChecklistItem?> PatchChecklistItemDoneState(int checklistItemId, bool taskDone)
    {
        ChecklistItem? checklistItem = await _dataBase.ChecklistItems
            .FirstOrDefaultAsync(ci => ci.ChecklistItemId == checklistItemId);
        if (checklistItem == null)
        {
            return null;
        }

        checklistItem.IsDone = taskDone;
        await _dataBase.SaveChangesAsync();
        return checklistItem;
    }
}