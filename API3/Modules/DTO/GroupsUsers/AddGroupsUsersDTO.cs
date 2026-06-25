using Domains.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modules.DTO.GroupsUsers
{
    public class AddGroupsUsersDTO
    {
        public int GroupId { get; set; }
        public List<int> UserIds { get; set; } = new();
    }
}
