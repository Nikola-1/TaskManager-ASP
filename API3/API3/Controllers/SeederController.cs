using DataAccess.Database;
using Domains.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API3.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SeederController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SeederController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Seeder()
        {

            var roles = new List<Role>
{
            new Role { Name = "Owner" },
            new Role { Name = "Member" }
                };
            await _context.Roles.AddRangeAsync(roles);
            await _context.SaveChangesAsync();
            var users = new List<User>
{
    new User
    {
        Username = "nikola",
        Email = "nikola@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "marko",
        Email = "marko@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "ana",
        Email = "ana@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "jelena",
        Email = "jelena@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "milos",
        Email = "milos@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "stefan",
        Email = "stefan@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "teodora",
        Email = "teodora@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "ivan",
        Email = "ivan@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "marija",
        Email = "marija@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    },
    new User
    {
        Username = "luka",
        Email = "luka@test.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
    }
};

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();
            var groups = new List<Group>
{
    new Group
    {
        Name = "TaskFlow Team",
        OwnerId = 1,
        Image_path = "3d-briefcase"
    },
    new Group
    {
        Name = "Frontend Developers",
        OwnerId = 2,
        Image_path = "3d-headphone"
    },
    new Group
    {
        Name = "Backend Developers",
        OwnerId = 3,
        Image_path = "3d-music"
    },
    new Group
    {
        Name = "QA Team",
        OwnerId = 4,
        Image_path = "3d-paper-bag"
    },
    new Group
    {
        Name = "Marketing",
        OwnerId = 5,
        Image_path = "3d-present"
    },
    new Group
    {
        Name = "Design Studio",
        OwnerId = 6,
        Image_path = "3d-star"
    },
    new Group
    {
        Name = "Fitness Club",
        OwnerId = 7,
        Image_path = "3d-tokens"
    },
    new Group
    {
        Name = "Book Readers",
        OwnerId = 8,
        Image_path = "hot-chocolate"
    },
    new Group
    {
        Name = "Gaming Squad",
        OwnerId = 9,
        Image_path = "Sunflower"
    },
    new Group
    {
        Name = "Travel Buddies",
        OwnerId = 10,
        Image_path = "3d-truck"
    }
};

            await _context.Groups.AddRangeAsync(groups);
            await _context.SaveChangesAsync();


            var usersGroups = new List<UsersGroups>
{
    new UsersGroups { id_user = 1, id_group = 1, id_role = 1 },
    new UsersGroups { id_user = 2, id_group = 1, id_role = 2 },

    new UsersGroups { id_user = 2, id_group = 2, id_role = 1 },
    new UsersGroups { id_user = 3, id_group = 2, id_role = 2 },

    new UsersGroups { id_user = 3, id_group = 3, id_role = 1 },
    new UsersGroups { id_user = 4, id_group = 3, id_role = 2 },

    new UsersGroups { id_user = 4, id_group = 4, id_role = 1 },
    new UsersGroups { id_user = 5, id_group = 4, id_role = 2 },

    new UsersGroups { id_user = 5, id_group = 5, id_role = 1 },
    new UsersGroups { id_user = 6, id_group = 5, id_role = 2 },
};

            await _context.UsersGroups.AddRangeAsync(usersGroups);
            await _context.SaveChangesAsync();
            var tags = new List<Tag>
{
    new Tag
    {
        name = "Important",
        color = "#FF0000",
        User_id = 1
    },

    new Tag
    {
        name = "Frontend",
        color = "#0066FF",
        User_id = 1,
        group_id = 1
    }
};

            await _context.Tags.AddRangeAsync(tags);
            await _context.SaveChangesAsync();
            var stickers = new List<Sticker>
{
    new Sticker { sticker_path = "3d-music" },
    new Sticker { sticker_path = "3d-present" },
    new Sticker { sticker_path = "3d-briefcase" },
    new Sticker { sticker_path = "3d-paper-bag" },
    new Sticker { sticker_path = "3d-star" },
    new Sticker { sticker_path = "3d-tokens" },
    new Sticker { sticker_path = "3d-truck" },
    new Sticker { sticker_path = "first-aid" },
    new Sticker { sticker_path = "lunch-box" },
    new Sticker { sticker_path = "snow-globe" },
    new Sticker { sticker_path = "christmas" },
    new Sticker { sticker_path = "gift-box" },
    new Sticker { sticker_path = "gift-box" },
    new Sticker { sticker_path = "christmas-lights" },
    new Sticker { sticker_path = "christmas-cookie" },
    new Sticker { sticker_path = "couch" },
    new Sticker { sticker_path = "pudding" },
    new Sticker { sticker_path = "yellow-watermelon" },
    new Sticker { sticker_path = "watermelon" },
    new Sticker { sticker_path = "durian" }
};

            await _context.Stickers.AddRangeAsync(stickers);
            await _context.SaveChangesAsync();



            var categories = new List<Category>
{
    new Category
    {
        Name = "Personal",
        user_id = 1,
        sticker_id = 1
    },
    new Category
    {
        Name = "Work",
        user_id = 2,
        sticker_id = 2
    },
    new Category
    {
        Name = "Study",
        user_id = 3,
        sticker_id = 3
    },
    new Category
    {
        Name = "Fitness",
        user_id = 4,
        sticker_id = 4
    },
    new Category
    {
        Name = "Shopping",
        user_id = 5,
        sticker_id = 5
    },
    new Category
    {
        Name = "Frontend",
        user_id = 1,
        group_id = 1,
        sticker_id = 6
    },
    new Category
    {
        Name = "Backend",
        user_id = 2,
        group_id = 2,
        sticker_id = 7
    },
    new Category
    {
        Name = "Testing",
        user_id = 3,
        group_id = 3,
        sticker_id = 8
    },
    new Category
    {
        Name = "Marketing",
        user_id = 4,
        group_id = 4,
        sticker_id = 9
    },
    new Category
    {
        Name = "Design",
        user_id = 5,
        group_id = 5,
        sticker_id = 10
    }
};

            await _context.Categories.AddRangeAsync(categories);
            await _context.SaveChangesAsync();

            var tasks = new List<TaskItem>();

            for (int userId = 1; userId <= 10; userId++)
            {
                tasks.Add(new TaskItem
                {
                    name = $"Task 1 User {userId}",
                    content = "Complete project documentation",
                    Status = "Todo",
                    user_id = userId,
                    category_id = userId <= 5 ? userId : null,
                    date = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
                });

                tasks.Add(new TaskItem
                {
                    name = $"Task 2 User {userId}",
                    content = "Review pull requests",
                    Status = "In Progress",
                    user_id = userId,
                    category_id = userId <= 5 ? userId : null,
                    date = DateOnly.FromDateTime(DateTime.Today.AddDays(2))
                });

                tasks.Add(new TaskItem
                {
                    name = $"Task 3 User {userId}",
                    content = "Attend team meeting",
                    Status = "Todo",
                    user_id = userId,
                    category_id = userId <= 5 ? userId : null,
                    date = DateOnly.FromDateTime(DateTime.Today.AddDays(3))
                });

                tasks.Add(new TaskItem
                {
                    name = $"Task 4 User {userId}",
                    content = "Fix reported bugs",
                    Status = "Done",
                    user_id = userId,
                    category_id = userId <= 5 ? userId : null,
                    Completed = true,
                    date = DateOnly.FromDateTime(DateTime.Today.AddDays(-1))
                });

                tasks.Add(new TaskItem
                {
                    name = $"Task 5 User {userId}",
                    content = "Prepare weekly report",
                    Status = "Todo",
                    user_id = userId,
                    category_id = userId <= 5 ? userId : null,
                    date = DateOnly.FromDateTime(DateTime.Today.AddDays(5))
                });
            }

            await _context.Tasks.AddRangeAsync(tasks);
            await _context.SaveChangesAsync();

            var tagTasks = new List<TagTasks>
{
    new TagTasks { id_task = 1, id_tag = 1 },
    new TagTasks { id_task = 2, id_tag = 1 },
    new TagTasks { id_task = 3, id_tag = 1 },
    new TagTasks { id_task = 4, id_tag = 1 },
    new TagTasks { id_task = 5, id_tag = 1 },

    new TagTasks { id_task = 6, id_tag = 2 },
    new TagTasks { id_task = 7, id_tag = 2 },
    new TagTasks { id_task = 8, id_tag = 2 },
    new TagTasks { id_task = 9, id_tag = 2 },
    new TagTasks { id_task = 10, id_tag = 2 }
};

            await _context.TagTasks.AddRangeAsync(tagTasks);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetDatabase()
        {
            await _context.Database.EnsureDeletedAsync();
            await _context.Database.MigrateAsync();

            return Ok();
        }

    }

   
}
