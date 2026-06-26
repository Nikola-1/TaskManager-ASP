using DataAccess.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.Users;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var Users = await _context.Users.ToListAsync();

            return Ok(Users);
        }
        [HttpGet("/api/Users/{search}")]
        public async Task<IActionResult> GetBySearch(string search)
        {
            var users = await _context.Users.Where(x=>x.Email.Contains(search) || x.Username.Contains(search)).ToListAsync();
            if(users.Any())
            {
                return Ok(users);
            }
            else
            {
                return StatusCode(404, "User not found");
            }
            
        }

    }
}
