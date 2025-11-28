using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Card
    {
        [Key]
        public int CardId { get; set; }
        
        public int CardListId { get; set; }
        public CardList CardList { get; set; } = null!;
        
        [Required]
        [MinLength(1)] [MaxLength(35)]
        public required string CardName { get; set; }
    }    
}