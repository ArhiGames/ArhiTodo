using System.ComponentModel.DataAnnotations;

namespace ArhiTodo.Models
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }
        
        public List<Board>? Boards { get; set; }
    }    
}