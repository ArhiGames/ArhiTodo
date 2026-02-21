using ArhiTodo.Domain.Entities.DTOs;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class CardMapper
{
    public static CardGetDto ToGetDto(this Card card)
    {
        return new CardGetDto
        {
            CardId = card.CardId,
            Position = card.Position,
            IsDone = card.IsDone,
            CardName = card.CardName,
            CardDescription = card.CardDescription,
            LabelIds = card.Labels.Select(cl => cl.LabelId).ToList(),
            AssignedUserIds = card.AssignedUsers.Select(asu => asu.UserId).ToList(),
            Checklists = card.Checklists.Select(cl => cl.ToGetDto()).ToList()
        };
    }
}