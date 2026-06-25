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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var taskExists = await _context.Tasks
    .AnyAsync(x => x.Id == dto.id_task && x.user_id == userId);

            var tagExists = await _context.Tags
                .AnyAsync(x => x.Id == dto.id_tag && x.User_id == userId);

            if (!taskExists || !tagExists)
            {
                return NotFound("Task or tag not found.");
            }
            var TagTaskConneciton = new TagTasks
            {
                id_task = dto.id_task,
                id_tag = dto.id_tag,
            };
            _context.TagTasks.Add(TagTaskConneciton);
            await _context.SaveChangesAsync();


            return Ok(TagTaskConneciton);


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
