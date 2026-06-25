using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.DTO.GroupsUsers
{
    public class DeleteGroupsUsersDTO
    {
        public int GroupId { get; set; }
        public List<int> UserIds { get; set; } = new();
    }
}
