using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Board
    {
        [Key]
        public int BoardId { get; set; }
        
        [Required]
        [MinLength(8)] [MaxLength(50)]
        public required string BoardName { get; set; }
        
        public List<CardList>? CardLists { get; set; }
    }    
}