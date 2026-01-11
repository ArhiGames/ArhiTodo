using ArhiTodo.Application.DTOs.Card;
using ArhiTodo.Domain.Entities.Kanban;

namespace ArhiTodo.Application.Mappers;

public static class CardMapper
{
    public static Card FromCreateDto(this CardCreateDto cardCreateDto, int cardListId)
    {
        return new Card
        {
            CardListId = cardListId,
            CardName = cardCreateDto.CardName
        };
    }

    public static CardGetDto ToGetDto(this Card card)
    {
        return new CardGetDto
        {
            CardId = card.CardId,
            IsDone = card.IsDone,
            CardName = card.CardName,
            CardDescription = card.CardDescription,
            LabelIds = card.CardLabels.Select(cl => cl.LabelId).ToList(),
            Checklists = card.Checklists.Select(cl => cl.ToGetDto()).ToList()
        };
    }
}