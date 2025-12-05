using App.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace App.DAL
{
    public class SysRolePageRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public SysRolePageRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
        public int AddPagesToRoles(string pages, string rol,string user,bool type)
        {
            try
            {
                var pagesArray = pages.Split(',');
                var list = (dynamic)null;
                if (type)//Paginas de tienda
                {
                    
                }
                else // Paginas Global
                {
                     list = _context.SYS_PAGE_MASTER.Where(x => pagesArray.Contains(x.page_id) && !x.SYS_ROLE_PAGE.Any(y => y.role_id == rol && pagesArray.Contains(y.page_id))).ToList();
                    foreach (var id in list)
                    {
                        SYS_ROLE_PAGE role = new SYS_ROLE_PAGE();
                        role.page_id = id.page_id;
                        role.role_id = rol;
                        role.cdate = DateTime.Now;
                        role.cuser = user;
                        role.program_id = "ADMS003.cshtml";

                        _context.SYS_ROLE_PAGE.Add(role);
                        _context.SaveChanges();
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }

        }
        public int RemovePagesFromRoles(string pages, string rol, bool type)
        {
            try
            {
                var pagesArray = pages.Split(',');
                if (type)
                {
                  
                }
                else
                {
                    _context.SYS_ROLE_PAGE.RemoveRange(_context.SYS_ROLE_PAGE.Where(x => pagesArray.Contains(x.page_id) && x.role_id == rol));
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
    }
}
