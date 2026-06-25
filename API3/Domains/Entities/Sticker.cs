using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Sticker
    {
        public int Id { get; set; }
        public string sticker_path { get; set; } = null!;
        public DateTime Created_at { get; set; } = DateTime.UtcNow;
    }
}
