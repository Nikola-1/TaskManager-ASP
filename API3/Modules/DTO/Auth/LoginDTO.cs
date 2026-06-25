using System.ComponentModel.DataAnnotations;

namespace API3.DTO.Auth
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        
        public string Password { get; set; } = null!;
    }
}
