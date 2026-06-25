using DataAccess.Database;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO;
using Modules.DTO.Tags;
using System.Security.Claims;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> Get(int id, [FromQuery] int? groupId)
        {
            IQueryable<Tag> query = _context.Tags.Where(x => x.User_id == id);

            if (groupId == null)
            {
                query = query.Where(x => x.group_id == null);
            }
            else
            {
                query = query.Where(x => x.group_id == groupId);
            }

            var tags = await query.ToListAsync();

            return Ok(new
            {
                message = "Tags successfully loaded.",
                data = tags
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var tag = await _context.Tags
       .FirstOrDefaultAsync(x => x.Id == id && x.User_id==userId);
            if (tag == null)
            {
                return NotFound("Tag not found.");
            }
            return Ok(tag);
        }


        [HttpPost]
        public async Task<IActionResult> Post(CreateTagDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var Tag = new Tag
            {

                color = dto.Color,
                name = dto.Name,
                parent_id = dto.parent_id,
                User_id = userId,
                group_id = dto.group_id

            };
            _context.Tags.Add(Tag);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = $"Tag {Tag.name} created",
                PostedTag= Tag
            });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateTagDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var Tag = await _context.Tags.FirstOrDefaultAsync(x => x.Id == id && x.User_id == userId);
            if (Tag == null)
            {
                return NotFound("Tag was not found");
            }
            Tag.name = dto.name;
            Tag.parent_id = dto.parent_id;
            Tag.color = dto.color;
            _context.Update(Tag);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message =$"Tag {Tag.name} successfully updated.",
                data = Tag
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var Tag = await _context.Tags.FirstOrDefaultAsync(x=>x.Id==id && x.User_id==userId);
            
            if(Tag == null)
            {
                return NotFound("Tag is not found");
            }

            _context.Tags.Remove(Tag);

            await _context.SaveChangesAsync();
            
            return Ok(new
            {
                message = $"Tag {Tag.name} successfully deleted."
            });
        }
    }
}
