
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.Files;
using API3;
using DataAccess.Database;
using Domains.Entities;
using API3.Extensions;
using System.Security.Claims;
namespace API3.Controllers
{
    [ApiController]
    [Route("/api/tasks/{taskId}/attachments")]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public AttachmentController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }
        [HttpGet("{attachmentId}/download")]
        public async Task<IActionResult> Download(int taskId, int attachmentId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var attachment = await _context.Attachments
                .Include(x => x.TaskItem)
                .FirstOrDefaultAsync(x =>
                    x.Id == attachmentId &&
                    x.TaskItemId == taskId &&
                    x.TaskItem.user_id == userId);

            if (attachment == null)
                return NotFound();

            var fullPath = Path.Combine(
                _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                attachment.FilePath.TrimStart('/')
            );

            if (!System.IO.File.Exists(fullPath))
                return NotFound("File not found on server.");

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);

            return File(bytes, "application/octet-stream", attachment.FileName);
        }
        [HttpPost]
        public async Task<IActionResult> Upload( int taskId,IFormFile file)
        {

            


            if (file.Length > 5* 1024 *1024)
            {
                return BadRequest("File is too large.");
            }
            var userId = User.GetUserId();


            var TaskExists = await _context.Tasks.AnyAsync(x => x.Id == taskId && x.user_id == userId);

            if (!TaskExists)
            {
                return NotFound();
            }
            if(file == null || file.Length == 0)
            {
                return BadRequest("File is required");
            }
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachment = new Attachment { 
                    FileName =  file.FileName,
                    FilePath = $"/uploads/{uniqueFileName}",
                    TaskItemId = taskId
            };
            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            return Created($"/api/tasks/{taskId}/attachments/{attachment.Id}",new
            {
                message = "File uploaded successfully.",
                attachmentId = attachment.Id,
                path = attachment.FilePath
            });
          
        }
        [HttpGet]
        public async Task<IActionResult> GetForTask(int taskId)
        {

            var taskExists = await _context.Tasks.AnyAsync(x=>x.Id == taskId);
            if (!taskExists)
            {
                return NotFound("Task not found.");
            }
            var attachments = await _context.Attachments
                .Where(x => x.TaskItemId == taskId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new AttachmentResponseDTO
                {
                    Id = x.Id,
                    FileName = x.FileName,
                    FilePath = x.FilePath,
                    TaskItemId = x.TaskItemId,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return Ok(attachments);
        }
    }
}
