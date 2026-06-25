using Domains.Entities;

namespace Modules.DTO
{
    public class TaskResponseDTO
    {
        public int Id { get; set; }
        public string name { get; set; } = null!;
        public string? content { get; set; }
        public string Status { get; set; } = null!;
        public int? user_id { get; set; }
        public int? category_id { get; set; }
        public string? sticker_path { get; set; }
        public string? AssignedUsername { get; set; }
        public DateOnly Date { get; set; }
        public bool Completed { get; set; }
        public bool Deleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Tag>? Tags { get; set; }
        public int? group_id { get; set; }
    }
}
