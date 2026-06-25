using DataAccess.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class StickersController : ControllerBase
    {

        private readonly AppDbContext _context;

        public StickersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var stickers = await _context.Stickers.ToListAsync();

            return Ok(stickers);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var sticker = await _context.Stickers.FindAsync(id);

            return Ok(sticker);
        }

       
    }
}
