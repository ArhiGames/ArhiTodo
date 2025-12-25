using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Card
    {
        [Key]
        public int CardId { get; set; }
        
        [Required]
        [MinLength(1)] [MaxLength(90)]
        public required string CardName { get; set; }

        public List<CardLabel> CardLabels { get; set; } = new();
        
        public int CardListId { get; set; }
        public CardList CardList { get; set; } = null!;
    }    
}