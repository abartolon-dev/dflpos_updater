using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Entities.ViewModels.User
{
    public class UserPayRollBasic
    {
        public string UserEmpNo { get; set; }
        public string UserName { get; set; }
        public string UserDepartment { get; set; }
        public string UserWorkstation { get; set; }
        public string UserSiteCode { get; set; }
        public bool UserFlag { get; set; }
        public bool UserRequest { get; set; }
        public List<string> ViaticumRequested { get; set; }
    }
}
