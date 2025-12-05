using App.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace App.DAL
{
    public class SysRoleMasterRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public SysRoleMasterRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
        public ICollection<SYS_ROLE_MASTER> GetAllRolesAdmin()
        {
            return _context.SYS_ROLE_MASTER.Select(x => x).ToList();
        }
       
        public SYS_ROLE_MASTER getRoleByID(string rolId)
        {
            return _context.SYS_ROLE_MASTER.FirstOrDefault(x => x.role_id == rolId);
        }
      
        public int AddRolesMaster(SYS_ROLE_MASTER rol)
        {
            try
            {
                _context.SYS_ROLE_MASTER.Add(rol);
                return _context.SaveChanges();

            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }

        }
     
        public int updateRoleMaster(SYS_ROLE_MASTER rol)
        {
            _context.Entry(rol).State = System.Data.Entity.EntityState.Modified;
            return _context.SaveChanges();
        }
     

        public SYS_ROLE_MASTER SearchRole(string id_role)
        {
            var role = _context.SYS_ROLE_MASTER.Where(w => w.role_id == id_role).FirstOrDefault();
            if (role != null)
                return role;
            else
                return null;
        }

 
        public string GetCutEmails(List<string> StoreEmails)
        {
            string emails = "";
            if (StoreEmails.Count == 1)
            {
                emails = StoreEmails[0];
            }
            else
            {
                var lastEmail = StoreEmails.Last();
                foreach (var item in StoreEmails)
                {

                    if (lastEmail.Equals(item))
                    {
                        emails += item;
                    }
                    else
                    {
                        if (emails == "")
                            emails = item + ",";
                        else
                            emails = emails + item + ",";
                    }
                }
            }
            return emails;
        }
        public List<string> GetRoleByUserName(string userName)
        {
            var r = _context.Database.SqlQuery<string>(@"select role_id from DFLPOS_UPDATER.dbo.USER_MASTER A
                            JOIN DFLPOS_UPDATER.dbo.SYS_ROLE_USER B ON A.emp_no = B.emp_no
                            where A.user_name = '" + userName + @"'").ToList();
            return r;
        }

    }
}
