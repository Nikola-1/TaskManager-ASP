namespace Domains.Entities
{
    public class Group
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;


        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;
        public string? Image_path { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
