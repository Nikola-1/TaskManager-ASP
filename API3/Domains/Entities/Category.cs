using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public int? sticker_id { get; set; }
        [ForeignKey("sticker_id")]
        public Sticker? Sticker { get; set; }
        public string Name { get; set; } = null!;

        public int? group_id { get; set; }
        [ForeignKey("group_id")]
        public Group group { get; set; } = null!;   

        public int user_id { get; set; }
        [ForeignKey("user_id")]
        public User User { get; set; } = null!;


    }
}
