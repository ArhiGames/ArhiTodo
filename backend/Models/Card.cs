using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Card
    {
        [Key]
        public int CardId { get; set; }
        
        public bool IsDone { get; set; } = false;
        
        [Required]
        [MinLength(1)] [MaxLength(90)]
        public required string CardName { get; set; }

        [MaxLength(8192)] 
        public string CardDescription { get; set; } = string.Empty;
        
        
        public List<CardLabel> CardLabels { get; set; } = new();
        
        public int CardListId { get; set; }
        public CardList CardList { get; set; } = null!;
    }    
}