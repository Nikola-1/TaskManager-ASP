namespace Domains.Entities
{
    public class Attachment
    {
        public int Id { get; set; }

        public string FileName { get; set; } = null!;

        public string FilePath { get; set; } = null!;

        public int TaskItemId { get; set; }

        public TaskItem TaskItem { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
