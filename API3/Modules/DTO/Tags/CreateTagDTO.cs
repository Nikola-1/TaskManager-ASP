using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.DTO.Tags
{
    public class CreateTagDTO
    {
        public string? Color { get; set; }
        public string Name { get; set; } = null;
        
        public int? parent_id { get; set; }
        public int user_id { get; set; }

        public int? group_id { get; set; }
    }
}
