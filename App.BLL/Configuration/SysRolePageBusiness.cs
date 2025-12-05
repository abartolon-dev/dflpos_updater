using App.DAL;
using App.Entities;
using System.Collections.Generic;
namespace App.BLL.Configuration
{
    public class SysRolePageBusiness
    {
        private SysRolePageRepository _RolePageRepo;
        //constructor
        public SysRolePageBusiness()
        {
            _RolePageRepo = new SysRolePageRepository();
        }
        public bool AddPagesToRoles(string rol, string pages,string user, bool type)
        {
            var check = false;
            var flag = _RolePageRepo.AddPagesToRoles(rol, pages,user,type);

            if (flag > 0) check = true;

            return check;
        }
        public bool RemovePagesFromRoles(string rol, string pages,bool type)
        {
            var check = false;
            var flag = _RolePageRepo.RemovePagesFromRoles(rol, pages,type);

            if (flag > 0) check = true;

            return check;
        }
    }
}
