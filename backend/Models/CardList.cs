using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class CardList
    {
        [Key]
        public int CardListId { get; set; }
        
        [Required]
        [MinLength(1)] [MaxLength(35)]
        public required string CardListName { get; set; }

        public List<Card> Cards { get; set; } = null!;
    }    
}