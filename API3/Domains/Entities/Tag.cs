using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Tag
    {
        public int Id { get; set; }
        public string? color { get; set; } = null;
        public string name { get; set; } = null!;
        public DateTime Created_at { get; set; } = DateTime.UtcNow;

        public int? parent_id { get; set; }
        [ForeignKey("parent_id")]
        public Tag? parent { get; set; }

        public int User_id { get; set; }

        [ForeignKey("User_id")]

        public User User { get; set; } = null!;
        
        public int? group_id { get; set; }
        public Group? Group { get; set; }
        
    }
}
