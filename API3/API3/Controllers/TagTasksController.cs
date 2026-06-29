using API3.Extensions;
using DataAccess.Database;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.Tags;
using System.Security.Claims;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class TagTasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagTasksController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var TagsTasks = await _context.TagTasks.Where(x=>x.Tag.User_id==userId).ToListAsync();
            return Ok(TagsTasks);


        }
        [HttpPost]
        public async Task<IActionResult> Post(CreateTagsTasksDTO dto)
        {
            var userId = User.GetUserId();

            var task = await _context.Tasks
                .FirstOrDefaultAsync(x => x.Id == dto.id_task);

            if (task == null)
                return NotFound(new { message = "Task not found." });

            var tag = await _context.Tags
                .FirstOrDefaultAsync(x => x.Id == dto.id_tag);

            if (tag == null)
                return NotFound(new { message = "Tag not found." });

            if (task.group_id == null)
            {
                if (task.user_id != userId || tag.User_id != userId)
                    return Forbid();
            }
            else
            {
                var isMember = await _context.UsersGroups.AnyAsync(x =>
                    x.id_user == userId &&
                    x.id_group == task.group_id.Value);

                if (!isMember || tag.group_id != task.group_id)
                    return Forbid();
            }

            var exists = await _context.TagTasks.AnyAsync(x =>
                x.id_task == dto.id_task &&
                x.id_tag == dto.id_tag);

            if (exists)
            {
                return BadRequest(new
                {
                    message = "This tag is already connected to the task."
                });
            }

            var tagTaskConnection = new TagTasks
            {
                id_task = dto.id_task,
                id_tag = dto.id_tag,
            };

            _context.TagTasks.Add(tagTaskConnection);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tag connected to task successfully.",
                data = tagTaskConnection
            });
        }
        [HttpDelete("{id_tag}/{id_task}")]
        public async Task<IActionResult> Delete(int id_tag,int id_task)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var tagsTaskConnection = await _context.TagTasks.FirstOrDefaultAsync(x=>x.id_tag == id_tag && x.id_task==id_task && x.Tag.User_id==userId);
            if (tagsTaskConnection == null)
            {
                return NotFound("Connection between tag and Task not found");
            }
            _context.TagTasks.Remove(tagsTaskConnection);
            await _context.SaveChangesAsync();
            return Ok(tagsTaskConnection);
        }
    }
}
