using API3.Extensions;
using DataAccess.Database;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Modules.DTO.GroupsUsers;

namespace API3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize]
    public class UsersGroupController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersGroupController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var UsersGroups = await _context.UsersGroups.ToListAsync();

            return Ok(UsersGroups);
        }
        [HttpGet("{GroupId}")]
        public async Task<IActionResult> GetUsersByGroup(int GroupId)
        {

            var Users = await _context.UsersGroups.Where(x => x.id_group == GroupId).Select(x => x.User).ToListAsync();

            return Ok(Users);
        }
        [HttpPost]
        public async Task<IActionResult> Post(AddGroupsUsersDTO dto)
        {
            var UserId = User.GetUserId();
            string message = "";
            var isOwner = await _context.Groups.FirstOrDefaultAsync(x=>x.OwnerId== UserId && dto.GroupId==x.Id);
            if (isOwner == null)
            {
                return BadRequest(new
                {
                    message = "You are not the owner of Group"
                });
            }
            var existingUserIds = await _context.UsersGroups.Distinct()
    .Where(x => x.id_group == dto.GroupId && dto.GroupId==isOwner.Id )
    .Select(x => x.id_user)
    .ToListAsync();

            var newMembers = dto.UserIds
                .Where(id => !existingUserIds.Contains(id))
                .Select(id => new UsersGroups
                {
                    id_user = id,
                    id_group = dto.GroupId,
                    id_role = 1
                });
            message = "Users successfully added";
            _context.UsersGroups.AddRange(newMembers);
            await _context.SaveChangesAsync();

            


            return Ok(new{ message = message, newUsers=newMembers });

        }
        [HttpDelete]
        public async Task<IActionResult> Delete(DeleteGroupsUsersDTO dto)
        {
            var UserId = User.GetUserId();
            string message = "";
            var isOwner = await _context.Groups.FirstOrDefaultAsync(x => x.OwnerId == UserId && dto.GroupId == x.Id);
            if (isOwner == null)
            {
                
                return BadRequest(new { message = "You are not the owner of Group" });
            }


            message = "Users successfully deleted";
            var usersToDelete = await _context.UsersGroups
    .Where(x => x.id_group == dto.GroupId &&
                dto.UserIds.Contains(x.id_user) &&
                x.id_user != UserId)
    .ToListAsync();
            _context.UsersGroups.RemoveRange(usersToDelete);
            await _context.SaveChangesAsync();




            return Ok(new { message = message , data = usersToDelete });

            }
    }
}
