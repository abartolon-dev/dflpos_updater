using App.DAL;
using App.Entities;
using System.Collections.Generic;
using System.Data;

namespace App.BLL.Configuration
{
    public class SysRoleUserBusiness
    {
        private SysRoleUserRepository _RoleUserRepo;
        //constructor
        public SysRoleUserBusiness()
        {
            _RoleUserRepo = new SysRoleUserRepository();
        }
        public ICollection<SYS_ROLE_MASTER> GetAllRolesOfUser(string EmployeeNumber)
        {
            return _RoleUserRepo.GetAllRolesOfUser(EmployeeNumber);
        }
       
        public ICollection<SYS_ROLE_MASTER> GetAllRolesAvailable(string EmployeeNumber)
        {
            return _RoleUserRepo.GetAllRolesAvailable(EmployeeNumber);
        }
      
        public bool AddRolesToUser(string EmployeeNumber, string Roles, string user)
        {
            var check = false;
            var flag = _RoleUserRepo.AddRolesToUser(EmployeeNumber, Roles, user);

            if (flag > 0) check = true;

            return check;
        }
      
        public bool RemoveRolesFromUser(string EmployeeNumber, string Roles)
        {
            var check = false;
            var flag = _RoleUserRepo.RemoveRolesFromUser(EmployeeNumber, Roles);

            if (flag > 0) check = true;

            return check;
        }
       
        
    }
}
