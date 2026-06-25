using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class UsersGroups
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int id_user { get; set; }
        public User User { get; set; } = null!;
        public int id_group { get; set; }

        public Group Group { get; set; } = null!;
        public int id_role { get; set; }
        public Role Role { get; set; } = null!;
    }
}
