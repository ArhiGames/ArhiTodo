using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }
        
        [Required]
        [MinLength(1)] [MaxLength(30)]
        public required string ProjectName { get; set; }

        public List<Board> Boards { get; set; } = new();
    }    
}