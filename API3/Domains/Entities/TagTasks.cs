using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{
    public class TagTasks
    {
        public int Id { get; set; }
        public int id_task { get; set; }
        [ForeignKey("id_task")]

        public TaskItem Task { get; set; } = null!;
        public int id_tag { get; set; }
        [ForeignKey("id_tag")]
        public Tag Tag { get; set; } = null!;
       
       
    }
}
