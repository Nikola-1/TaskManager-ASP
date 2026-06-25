using DataAccess.Database;
using Modules.DTO;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AutoMapper;
using Modules.Interfaces;
namespace API3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditService _auditService;
        private readonly IMapper _mapper;
        public TasksController(AppDbContext context,IAuditService auditService,IMapper mapper)
        {

            _context = context;
            _auditService = auditService;
            _mapper = mapper;
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return null;
            }

            return int.Parse(userIdClaim);
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateTaskDTO dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();
            var task = new TaskItem
            {
                name = dto.name,
                content = dto.content,
                user_id = userId,
                Status = "To do",
                date=dto.Date,
                category_id=dto.category_id,
                group_id=dto.group_id
            };
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                GetCurrentUserId(),
                "Created",
                "Task",
                task.Id
                );
            return Ok(new
            {
                message="Task successfully added",
                data=task
            });
        }
        [HttpGet]
        public async Task<IActionResult> GetAll(
   string? keyword,
   string? status,
   int? groupId,
   int? tagId,
   int page = 1,
   int perPage = 100)
        {

            var userId = GetCurrentUserId();
           
            var query = _context.Tasks
                .Include(x => x.user)
                .Include(x=>x.Attachments)
                .Include(x => x.category)
                    .ThenInclude(y => y.Sticker)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.name.Contains(keyword));
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(x => x.Status.Contains(status));
            }

            if (tagId.HasValue)
            {
                query = query.Where(task =>
                    _context.TagTasks.Any(tt =>
                        tt.id_task == task.Id &&
                        tt.id_tag == tagId.Value
                    )
                );
            }
            if( groupId.HasValue)
            {
                var isMember = await _context.UsersGroups.AnyAsync(x => x.id_user == userId && x.id_group == groupId.Value);

                if (!isMember)
                
                    return Forbid();
                
                query = query.Where(task => task.group_id == groupId.Value);
            }
            else
            {
                query = query.Where(task => task.group_id == null && task.user_id==userId);
            }
           
            var TotalCount = await query.CountAsync();

            var tasks = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * perPage)
                .Take(perPage)
                .Select(x => new TaskResponseDTO
                {
                    Id = x.Id,
                    name = x.name,
                    content = x.content,
                    Status = x.Status,
                    user_id = x.user_id,
                    attachments=x.Attachments,
                    AssignedUsername = x.user != null ? x.user.Username : null,
                    CreatedAt = x.CreatedAt,
                    Deleted = x.Deleted,
                    Completed = x.Completed,
                    Date = x.date,
                    category_id = x.category_id,
                    sticker_path = x.category.Sticker.sticker_path,
                    Tags = _context.TagTasks.Where(tt => tt.id_task == x.Id).Join(_context.Tags, tt => tt.id_tag, tag => tag.Id, (tt, tag) => tag).ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                TotalCount,
                page,
                perPage,
                data = tasks
            });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {

            var userId = GetCurrentUserId();
            var task = await _context.Tasks
       .Include(x => x.user)
       .Include(x => x.Comments)
       .Include(x => x.Attachments)
       .FirstOrDefaultAsync(x => x.Id == id && x.user_id==userId);
            if (task == null)
            {
                return NotFound("Task not found.");
            }
            return Ok(_mapper.Map<TaskResponseDTO>(task));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateTaskDTO dto)
        {
            var userId = GetCurrentUserId();
            var task = await _context.Tasks.FirstOrDefaultAsync(x=>x.Id==id && x.user_id==userId);
            if (task == null)
            {
                return NotFound("Task ne postoji");
            }
            task.name = dto.name;
            task.content = dto.content;
            task.Status = dto.Status;
            task.Completed = dto.Completed;
            task.Deleted = dto.Deleted;
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(
                GetCurrentUserId(),
                "Update",
                "Task",
                task.Id
                );
            return Ok(task);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            var task = await _context.Tasks.FirstOrDefaultAsync(x=>x.Id == id && x.user_id==userId);
            if (task == null)
            {
                return NotFound("Ne postoji izabrani task");
            }
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(
                GetCurrentUserId(),
                "Delete",
                "Task",
                task.Id
                );
            return Ok(new {message = "Task deleted"});
        }

    }
}
