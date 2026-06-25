using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.DTO.Tags
{
    public class UpdateTagDTO
    {
        public string? color {  get; set; }
        public string name { get; set; } = null!;
        public int? parent_id { get; set; }
    }
}
