using System.ComponentModel.DataAnnotations;

namespace API3.DTO.Comments
{
    public class CommentResponseDTO
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string Text { get; set; } = null!;
        public int TaskItemId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

    }
}
