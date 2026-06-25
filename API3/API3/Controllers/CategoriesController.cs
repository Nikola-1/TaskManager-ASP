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

        [HttpGet]
        
        public async Task<IActionResult> Get([FromQuery] int? groupId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            IQueryable<Category> query = _context.Categories
                .Include(x => x.Sticker)
                .Where(x => x.user_id == userId);

            if (groupId == null)
            {
                // Privatne kategorije
                query = query.Where(x => x.group_id == null);
            }
            else
            {
                // Kategorije određene grupe
                query = query.Where(x => x.group_id == groupId);
            }

            var categories = await query.ToListAsync();

            return Ok(new
            {
                message = "Categories successfully loaded.",
                data = categories
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var categorie = await _context.Categories.Include(x=>x.Sticker).FirstOrDefaultAsync(x=>x.Id==id && x.user_id==userId);
            if (categorie == null)
                return NotFound("Category not found.");

            return Ok(categorie);
        }
        [HttpPost]
        public async Task<IActionResult> Post(CreateCategoryDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var Categorie = new Category
            {
                Name = dto.Name,
                sticker_id = dto.sticker_id,
                group_id = dto.group_id,
                user_id = userId,
            };

            _context.Categories.Add(Categorie);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message=$"Catgorie {Categorie.Name} successfully added",
                PostedCategorie=Categorie
            });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,UpdateCategoryDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var categorie = await _context.Categories.FirstOrDefaultAsync(x=>x.Id == id && x.user_id==userId);
            if (categorie == null)
            {
                return NotFound("Categorie ne postoji");
            }
            categorie.Name=dto.Name;
            categorie.group_id=dto.group_id;
            categorie.sticker_id=dto.sticker_id;

            await _context.SaveChangesAsync();
            return Ok(
                new
                {
                    message = $"Catgorie {categorie.Name} successfully edited",
                    EditedCategorie = categorie
                }
                );
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var categorie = await _context.Categories.FirstOrDefaultAsync(x=>x.Id == id && x.user_id==userId);
            if (categorie == null)
            {
                return NotFound("Not found");
            }
            _context.Remove(categorie);
            await _context.SaveChangesAsync();
            return Ok(new {
              message = $"Categorie {categorie.Name} deleted",
              Categorie = categorie

            });
        }
    }
}
