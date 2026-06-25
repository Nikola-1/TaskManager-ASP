namespace Domains.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string PasswordHash { get; set; } = null!;

        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();

        public string? PasswordResetCodeHash { get; set; }
        public DateTime? PasswordResetCodeExpiresAt { get; set; }


    }
}
