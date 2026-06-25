
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.Files;
using API3;
using DataAccess.Database;
using Domains.Entities;
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
        [HttpPost]
        public async Task<IActionResult> Upload( int taskId,IFormFile file)
        {

            


            if (file.Length > 5* 1024 *1024)
            {
                return BadRequest("File is too large.");
            }
            var userId = int.Parse(User.FindFirst("id")!.Value);


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
