namespace Domains.Entities
{
    public class TaskComment
    {
        public int Id { get; set; }

        public string Text { get; set; } = null!;

        public int TaskItemId { get; set; }

        public TaskItem TaskItem { get; set; } = null!;

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
