using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.DTO.Categories
{
    public class UpdateCategoryDTO
    {
        public string Name { get; set; } = null!;


        public int user_id { get; set; }


        public int? group_id { get; set; } = null;


        public int? sticker_id { get; set; } = null;
    }
}
