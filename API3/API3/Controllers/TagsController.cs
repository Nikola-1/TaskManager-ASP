using API3.Extensions;
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
        private async Task<bool> IsGroupMember(int userId, int groupId)
        {
            return await _context.UsersGroups.AnyAsync(x =>
                x.id_user == userId &&
                x.id_group == groupId);
        }
        private async Task<bool> IsGroupOwner(int userId, int groupId)
        {
            return await _context.UsersGroups.AnyAsync(x =>
                x.id_user == userId &&
                x.id_group == groupId &&
                x.Group.OwnerId==userId);
        }
        [HttpGet("users/{id}")]
        public async Task<IActionResult> Get(int id, [FromQuery] int? groupId)
        {
            IQueryable<Tag> query = _context.Tags;

            

            
            if (groupId == null)
            {

                query = query.Where(x => x.group_id == null && x.User_id==id);
            }
            else
            {
                var isMember = await IsGroupMember(id, groupId.Value);
                if (!isMember)
                {
                    return Forbid();
                }
                query = query.Where(x => x.group_id == groupId.Value);
            }

            var tags = await query.ToListAsync();

            return Ok(new
            {
                message = "Tags successfully loaded.",
                data = tags
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] int? groupId)
        {
            var userId = User.GetUserId();

            if (userId == null)
                return Unauthorized();

            IQueryable<Tag> query = _context.Tags;

            if (groupId == null)
            {
                query = query.Where(x =>
                    x.Id == id &&
                    x.User_id == userId.Value &&
                    x.group_id == null);
            }
            else
            {
                var isMember = await IsGroupMember(userId.Value, groupId.Value);

                if (!isMember)
                    return Forbid();

                query = query.Where(x =>
                    x.Id == id &&
                    x.group_id == groupId.Value);
            }

            var tag = await query.FirstOrDefaultAsync();

            if (tag == null)
                return NotFound("Tag not found.");

            return Ok(tag);
        }


        [HttpPost]
        public async Task<IActionResult> Post(CreateTagDTO dto)
        {
            var userId = User.GetUserId();
            var message = "";
            if (userId == null)
                return Unauthorized();

            if (dto.group_id != null)
            {
                var isMember = await IsGroupMember(userId.Value, dto.group_id.Value);
                var isOwner = await IsGroupOwner(userId.Value, dto.group_id.Value);
                
                if (!isMember)
                {
                    return StatusCode(403, new
                    {
                        message = "You are not the member of this group"
                    });

                }
                else
                {
                    if (!isOwner)
                    {
                        return StatusCode(403, new
                        {
                            message = "Only the group owner can create tags."
                        });

                    }
                }
                    
            }
            
            var tag = new Tag
            {
                color = dto.Color,
                name = dto.Name,
                parent_id = dto.parent_id,
                User_id = userId.Value,
                group_id = dto.group_id
            };
            message = $"Tag {tag.name} created";
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();
            
            return Ok(new
            {
                message = message,
                PostedTag = tag
            });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateTagDTO dto, [FromQuery] int? groupId)
        {
            var userId = User.GetUserId();

            if (userId == null)
                return Unauthorized();

            Tag? tag;

            if (groupId == null)
            {
                tag = await _context.Tags.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.User_id == userId.Value &&
                    x.group_id == null);
            }
            else
            {
                var isMember = await IsGroupMember(userId.Value, groupId.Value);

                if (!isMember)
                {
                    return StatusCode(403, new
                    {
                        message = "You are not the member of this group."
                    });
                }

                var isOwner = await IsGroupOwner(userId.Value, groupId.Value);

                if (!isOwner)
                {
                    return StatusCode(403, new
                    {
                        message = "Only the group owner can edit tags."
                    });
                }

                tag = await _context.Tags.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.group_id == groupId.Value);
            }

            if (tag == null)
            {
                return NotFound(new
                {
                    message = "Tag was not found."
                });
            }

            tag.name = dto.name;
            tag.parent_id = dto.parent_id;
            tag.color = dto.color;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Tag {tag.name} successfully updated.",
                data = tag
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int? groupId)
        {
            var userId = User.GetUserId();

            if (userId == null)
                return Unauthorized();

            Tag? tag;

            if (groupId == null)
            {
                tag = await _context.Tags.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.User_id == userId.Value &&
                    x.group_id == null);
            }
            else
            {
                var isMember = await IsGroupMember(userId.Value, groupId.Value);

                if (!isMember)
                {
                    return StatusCode(403, new
                    {
                        message = "You are not the member of this group."
                    });
                }

                var isOwner = await IsGroupOwner(userId.Value, groupId.Value);

                if (!isOwner)
                {
                    return StatusCode(403, new
                    {
                        message = "Only the group owner can delete tags."
                    });
                }

                tag = await _context.Tags.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.group_id == groupId.Value);
            }

            if (tag == null)
            {
                return NotFound(new
                {
                    message = "Tag was not found."
                });
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Tag {tag.name} successfully deleted."
            });
        }
    }
}
