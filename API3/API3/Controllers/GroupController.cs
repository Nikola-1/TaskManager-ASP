using API3.Extensions;
using DataAccess.Database;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.Groups;
using System.Security.Claims;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    
    public class GroupController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GroupController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.GetUserId();
            var groups = await _context.UsersGroups.Where(x => x.id_user == userId).Select(
                x=> new
                {
                    x.Group.Id,
                    x.Group.Name,
                    x.Group.Image_path,
                    MemberCount = _context.UsersGroups
                .Count(ug => ug.id_group == x.id_group)
                }
                ).ToListAsync();



            return Ok(groups);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroupById(int id)
        {
            var userId = User.GetUserId();
            var groups = await _context.UsersGroups.Where(x => x.id_user == userId && x.id_group==id).Select(
                x => new
                {
                    x.Group.Id,
                    x.Group.Name,
                    x.Group.Image_path,
                    MemberCount = _context.UsersGroups
                .Count(ug => ug.id_group == x.id_group)
                }
                ).ToListAsync();



            return Ok(groups);

        }
        [HttpPost]
        public async Task<IActionResult> Post(CreateGroupDTO dto)
        {
            var user = User.GetUserId();
            if (user == null)
            {
                return Unauthorized();
            }
            var group = new Group
            {
                Name = dto.Name,
                OwnerId = user.Value,
                Image_path = "3d-headphone",
            };
            
            _context.Groups.Add(group);

            await _context.SaveChangesAsync();
            var newGroupConnection = new UsersGroups
            {
                id_group = group.Id,
                id_user = user.Value,
                id_role= 2,
            };
            _context.UsersGroups.Add(newGroupConnection);

            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = $"Group {group.Name} successfully created.",
                data = new
                {
                    group,
                    groupConnection = newGroupConnection
                }
            });


        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var userId = User.GetUserId();
            if(userId == null)
            {
                return Unauthorized(new
                {
                    error = "You must be logged in."
                });
            }
            var Group = await _context.Groups.Where(x=>x.OwnerId==userId).FirstOrDefaultAsync(x => x.Id == id);
            if(Group == null)
            {
                return NotFound(new
                {
                    error = "Group was not found or you are not the owner"
                });
            }
            _context.Groups.Remove(Group);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Group successfully deleted",
                Data = Group
            });
        }
    }
}
