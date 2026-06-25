using System.ComponentModel.DataAnnotations;

namespace API3.DTO.Comments
{
    public class CreateCommentDTO
    {
        [Required]
        [MaxLength(255)]
        public string Text { get; set; } = null!;
    }
}
