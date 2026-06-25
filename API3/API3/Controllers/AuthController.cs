
using API3.DTO.Auth;
using DataAccess.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Domains.Entities;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Modules.DTO.Auth;
using Modules.Interfaces;

namespace API3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        public AuthController(AppDbContext context, IConfiguration configuration,IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var userExists = await _context.Users.AnyAsync(x=> x.Email == dto.Email);
            if (userExists) {
                return BadRequest("Korisnik vec postoji sa ovim email-om");
            }
            string passwordHash  = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var User  = new User
            {
               Username = dto.Username,
               Email = dto.Email,
               PasswordHash = passwordHash,
               Role ="User",
               
            };
            _context.Users.Add(User);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Registration Succssesful!"
            });
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x=>x.Email==dto.Email);
            if(user == null)
            {
                return Unauthorized("Invalid email or password.");

            }
           
            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password,user.PasswordHash);

            if (!validPassword) {
                return Unauthorized("Invalid email or password.");
            }
            var token = GenerateJwtToken(user);

            return Ok(new { token,user });
        }
        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)

            };
            var key = new SymmetricSecurityKey(
               Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
           );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x=>x.Email == dto.Email);

            if(user == null)
            {
                return Ok(new { message = "If email exists,reset code was sent" });
            }

            var code = Random.Shared.Next(100000, 999999).ToString();

            user.PasswordResetCodeHash = BCrypt.Net.BCrypt.HashPassword(code);
            user.PasswordResetCodeExpiresAt = DateTime.UtcNow.AddMinutes(10);


            await _context.SaveChangesAsync();
            await _emailService.SendEmailAsync(
                user.Email,
                "Password reset code",
                $"Your password reset code is:{code}"
                );


            return Ok(new { message = "If email exists,reset code was sent" });
        }
        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if(user == null)
            {
                return BadRequest("Invalid reset request");
            }

            if(user.PasswordResetCodeHash == null || user.PasswordResetCodeExpiresAt == null || user.PasswordResetCodeExpiresAt < DateTime.UtcNow)
            {
                return BadRequest("Reset code expired");
            }

            var validCode = BCrypt.Net.BCrypt.Verify(dto.Code,user.PasswordResetCodeHash);

            if (!validCode)
            {
                return BadRequest("Invalid reset code.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.PasswordResetCodeHash = null;
            user.PasswordResetCodeExpiresAt = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }
    }
}
