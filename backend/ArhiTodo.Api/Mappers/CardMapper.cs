using ArhiTodo.Models;
using ArhiTodo.Models.DTOs.Get;
using ArhiTodo.Models.DTOs.Post;

namespace ArhiTodo.Mappers;

public static class CardMapper
{
    public static Card FromCardPostDto(this CardPostDto cardPostDto)
    {
        return new Card()
        {
            CardName = cardPostDto.CardName
        };
    }

    extension(Card card)
    {
        public DetailedCardGetDto ToDetailedCardGetDto()
        {
            return new DetailedCardGetDto
            {
                CardId = card.CardId,
                IsDone = card.IsDone,
                CardName = card.CardName,
                CardDescription = card.CardDescription,
                Checklists = card.Checklists.Select(ci => ci.ToChecklistGetDto()).ToList(),
                Labels = card.CardLabels.Select(cl => cl.ToCardLabelGetDto()).ToList()
            };
        }

        public CardGetDto ToCardGetDto()
        {
            return new CardGetDto
            {
                CardId = card.CardId,
                CardName = card.CardName,
                IsDone = card.IsDone,
                Labels = card.CardLabels.Select(cl => cl.ToCardLabelGetDto()).ToList()
            };
        }
    }
}