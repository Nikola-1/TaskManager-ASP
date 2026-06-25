using DataAccess.Database;
using API3.DTO.Comments;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System.Security.Claims;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/tasks/{taskId}/comments")] //zasto { a ne [
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CommentController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> Create(int taskId, CreateCommentDTO dto)
        {
            var taskExists = await _context.Tasks.AnyAsync(x=>x.Id == taskId);
            if (!taskExists)
            {
                return NotFound("Task not found");
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim);

            var comment = new TaskComment
            {
                Text = dto.Text,
                TaskItemId = taskId,
                UserId = userId,
            };

            _context.TaskComments.Add(comment);
           await _context.SaveChangesAsync();
            return Ok(new
            {
                Comment = comment,
                message = "Comment successfuly created",
            });
        }
        [HttpGet]
        public async Task<IActionResult> GetForTask(int taskId)
        {
            var comments = await _context.TaskComments
                .Where(x => x.TaskItemId == taskId)
                .Include(x => x.User)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new CommentResponseDTO
                {
                    Id = x.Id,
                    Text = x.Text,
                    TaskItemId = x.TaskItemId,
                    UserId = x.UserId,
                    UserName = x.User.Username,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }
    }
}
