using App.Entities;
using App.Entities.ViewModels.SysInfo;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace App.DAL
{
    public class SysRoleUserRepository
    {
        private DFLPOS_UPDATEREntities _context;
        private SqlConnection objConn = null;
        private static string sSql = "";
        private static SqlCommand SQLcmd = null;
        private string connSql = ConfigurationManager.ConnectionStrings["DFLPOS_UPDATEREntities"].ToString();
        public SysRoleUserRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
        public ICollection<SYS_ROLE_MASTER> GetAllRolesOfUser(string EmployeeNumber)
        {
            return _context.SYS_ROLE_MASTER.Where(x => _context.SYS_ROLE_USER.Any(v => v.role_id == x.role_id && v.emp_no == EmployeeNumber)).OrderBy(x => x.role_id).ThenByDescending(x => x.role_id).ToList();
        }       
        
        public ICollection<SYS_ROLE_MASTER> GetAllRolesAvailable(string EmployeeNumber)
        {
            return _context.SYS_ROLE_MASTER.Where(x => !_context.SYS_ROLE_USER.Any(v => v.role_id == x.role_id && v.emp_no == EmployeeNumber)).OrderBy(x => x.role_id).ThenByDescending(x => x.role_id).ToList();
        }
        
        public int AddRolesToUser(string EmployeeNumber, string Roles, string user)
        {
            try
            {
                var pagesArray = Roles.Split(',');
                var list = _context.SYS_ROLE_MASTER.Where(x => pagesArray.Contains(x.role_id) && !x.SYS_ROLE_USER.Any(y => y.emp_no == EmployeeNumber && pagesArray.Contains(y.role_id))).ToList();

                foreach (var id in list)
                {
                    SYS_ROLE_USER role = new SYS_ROLE_USER();
                    role.role_id = id.role_id;
                    role.emp_no = EmployeeNumber;
                    role.cdate = DateTime.Now;
                    role.cuser = user;
                    role.program_id = "ADMS004.cshtml";

                    _context.SYS_ROLE_USER.Add(role);
                    _context.SaveChanges();
                }
                return 1;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }

        }
        

        public int RemoveRolesFromUser(string EmployeeNumber, string roles)
        {
            try
            {
                var pagesArray = roles.Split(',');
                _context.SYS_ROLE_USER.RemoveRange(_context.SYS_ROLE_USER.Where(x => pagesArray.Contains(x.role_id) && x.emp_no == EmployeeNumber));
                _context.SaveChanges();
                return 1;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }

        }
        

        public List<SysPageMaster> GetPagesByUser(string emp_no)
        {
            var x = _context.SYS_ROLE_USER.Join(_context.SYS_ROLE_PAGE, SRU => SRU.role_id, SRP => SRP.role_id, (SRU, SRP) => new { SRU, SRP })
                .Join(_context.SYS_PAGE_MASTER, SPM2 => SPM2.SRP.page_id, SPM => SPM.page_id, (SPM2, SPM) => new { SPM2, SPM })
                .Where(w => w.SPM2.SRU.emp_no == emp_no && w.SPM.active_flag == true)
                .Select(s => new SysPageMaster
                {
                    page_name = s.SPM.page_name,
                    url = s.SPM.url,
                    description = s.SPM.description
                }).Distinct().ToList();
            return x;
        }

        public string GetBuyerDivision(string user_name)
        {
            var obj = _context.USER_MASTER.Where(w => w.user_name == user_name).FirstOrDefault();
            return obj.buyer_division;
        }        
    }
}

