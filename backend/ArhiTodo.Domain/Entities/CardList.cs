namespace ArhiTodo.Domain.Entities;

public class CardList
{
    public int CardListId { get; set; }
    
    public required string CardListName { get; set; }
    
    public List<Card> Cards { get; set; } = [];
    
    public int BoardId { get; set; }
    public Board Board { get; set; } = null!;
}    