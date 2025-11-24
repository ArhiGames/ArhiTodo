using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class CardList
    {
        [Key]
        public int CardListId { get; set; }
        
        [Required]
        [MinLength(3)] [MaxLength(35)]
        public required string CardName { get; set; }

        public List<Card> Cards { get; set; } = null!;
    }    
}