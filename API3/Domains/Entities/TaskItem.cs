
using System.ComponentModel.DataAnnotations.Schema;

namespace Domains.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string? name { get; set; }

        public string? content { get; set; }
        public string? Status { get; set; }
        public int? user_id { get; set; }
        public int? category_id { get; set; }
        [ForeignKey(nameof(category_id))]
        public Category? category { get; set; }
        [ForeignKey(nameof(user_id))]
        public User? user { get; set; }
        public bool Completed { get; set; } = false;
        public bool Deleted { get; set; } = false;
        public string? file_name { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateOnly date {  get; set; }
        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();

        public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

        public int? group_id { get; set; }
        [ForeignKey(nameof(group_id))]
        public Group? group { get; set; }

    }
}
