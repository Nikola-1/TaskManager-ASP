using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.DTO.Groups
{
    public class CreateGroupDTO
    {
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public string? Image_path { get; set; }
    }
}
