using DataAccess.Database;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.Categories;
using System.Security.Claims;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                return null;

            return int.Parse(claim.Value);
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
                x.Group.OwnerId == userId);
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? groupId)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            IQueryable<Category> query = _context.Categories
                .Include(x => x.Sticker);

            if (groupId == null)
            {
                query = query.Where(x =>
                    x.group_id == null &&
                    x.user_id == userId.Value);
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

                query = query.Where(x =>
                    x.group_id == groupId.Value);
            }

            var categories = await query.ToListAsync();

            return Ok(new
            {
                message = "Categories successfully loaded.",
                data = categories
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] int? groupId)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            IQueryable<Category> query = _context.Categories
                .Include(x => x.Sticker);

            if (groupId == null)
            {
                query = query.Where(x =>
                    x.Id == id &&
                    x.user_id == userId.Value &&
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

                query = query.Where(x =>
                    x.Id == id &&
                    x.group_id == groupId.Value);
            }

            var category = await query.FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Category not found."
                });
            }

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Post(CreateCategoryDTO dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            if (dto.group_id != null)
            {
                var isMember = await IsGroupMember(userId.Value, dto.group_id.Value);

                if (!isMember)
                {
                    return StatusCode(403, new
                    {
                        message = "You are not the member of this group."
                    });
                }

                var isOwner = await IsGroupOwner(userId.Value, dto.group_id.Value);

                if (!isOwner)
                {
                    return StatusCode(403, new
                    {
                        message = "Only the group owner can create categories."
                    });
                }
            }

            var category = new Category
            {
                Name = dto.Name,
                sticker_id = dto.sticker_id,
                group_id = dto.group_id,
                user_id = userId.Value,
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Category {category.Name} successfully added.",
                PostedCategory = category
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateCategoryDTO dto, [FromQuery] int? groupId)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            Category? category;

            if (groupId == null)
            {
                category = await _context.Categories.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.user_id == userId.Value &&
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
                        message = "Only the group owner can edit categories."
                    });
                }

                category = await _context.Categories.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.group_id == groupId.Value);
            }

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Category not found."
                });
            }

            category.Name = dto.Name;
            category.sticker_id = dto.sticker_id;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Category {category.Name} successfully edited.",
                EditedCategory = category
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int? groupId)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            Category? category;

            if (groupId == null)
            {
                category = await _context.Categories.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.user_id == userId.Value &&
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
                        message = "Only the group owner can delete categories."
                    });
                }

                category = await _context.Categories.FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.group_id == groupId.Value);
            }

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Category not found."
                });
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Category {category.Name} deleted.",
                Category = category
            });
        }
    }
}