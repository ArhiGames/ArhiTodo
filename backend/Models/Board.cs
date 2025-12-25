using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Board
    {
        [Key]
        public int BoardId { get; set; }
        
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        
        [Required]
        [MinLength(1)] [MaxLength(35)]
        public required string BoardName { get; set; }
        
        public List<CardList> CardLists { get; set; } = new();
        public List<Label> Labels { get; set; } = new();
    }    
}