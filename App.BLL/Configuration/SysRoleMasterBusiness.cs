using App.DAL;
using App.Entities;
using System.Collections.Generic;

namespace App.BLL.Configuration
{
    public class SysRoleMasterBusiness
    {
        private SysRoleMasterRepository _RoleMasterRepo;

        //constructor
        public SysRoleMasterBusiness()
        {
            _RoleMasterRepo = new SysRoleMasterRepository();
        }
        public ICollection<SYS_ROLE_MASTER> GetAllRolesAdmin()
        {
            return _RoleMasterRepo.GetAllRolesAdmin();
        }       
        public SYS_ROLE_MASTER getRoleByID(string rol)
        {
            return _RoleMasterRepo.getRoleByID(rol);

        }       
        public bool AddRolesMaster(SYS_ROLE_MASTER Rol)
        {
            var check = false;
            var flag = _RoleMasterRepo.AddRolesMaster(Rol);

            if (flag > 0) check = true;

            return check;
        }       
        public bool updateRoleMaster(SYS_ROLE_MASTER rol)
        {
            var check = false;
            if (_RoleMasterRepo.updateRoleMaster(rol) > 0) check = true;
            return check;
        }       
        public string GetCutEmails(List<string> userEmails)
        {
            return _RoleMasterRepo.GetCutEmails(userEmails);
        }

        public List<string> GetRoleByUserName(string userName)
        {
            return _RoleMasterRepo.GetRoleByUserName(userName);
        }

            public SYS_ROLE_MASTER SearchRole(string id_role)
        {
            return _RoleMasterRepo.SearchRole(id_role);
        }       
    }
}
