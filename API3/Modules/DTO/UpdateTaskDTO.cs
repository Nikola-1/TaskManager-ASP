using System.ComponentModel.DataAnnotations;

namespace Modules.DTO
{
    public class UpdateTaskDTO
    {
        [Required]
        [MaxLength(100)]
        public string name { get; set; } = null!;
      
        [MaxLength(500)]
        public string? content { get; set; }
        public int user_id { get; set; }
        [Required]
        public string Status { get; set; } = "To do";
        public bool Deleted { get; set; } 
        public bool Completed { get; set; }
    }
}
