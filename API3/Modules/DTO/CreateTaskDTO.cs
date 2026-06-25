using System.ComponentModel.DataAnnotations;

namespace Modules.DTO
{
    public class CreateTaskDTO
    {
        [Required]
        [MaxLength(100)]
        public string name { get; set; } = null!;

        [MaxLength(500)]
        public string? content { get; set; } 
        public int user_id { get; set; }

        public int? category_id { get; set; }
        public string? file_name { get; set; }

        public DateOnly Date {  get; set; }
        public bool Completed { get; set; } = false;
        public bool Deleted { get; set; } = false;
        public int? group_id { get; set; }
    }
}
