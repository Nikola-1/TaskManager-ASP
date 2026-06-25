using System.ComponentModel.DataAnnotations;

namespace API3.DTO.Auth
{
    public class RegisterDTO
    {
        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string? Username {  get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        [MinLength(6)]
        public string? Password { get; set; }

    }
}
