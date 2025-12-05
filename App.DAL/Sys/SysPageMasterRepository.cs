using App.Entities;
using System;
using System.Collections.Generic;
using System.Linq;


namespace App.DAL
{
    public class SysPageMasterRepository
    {
        private DFLPOS_UPDATEREntities _context;

        public SysPageMasterRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }
        public List<SYS_PAGE_MASTER> GetAllPagesAdmin()
        {
            return _context.SYS_PAGE_MASTER.Select(x => x).ToList();
        }       
        public SYS_PAGE_MASTER GetPageByID(string page_id)
        {
            return _context.SYS_PAGE_MASTER.FirstOrDefault(x => x.page_id == page_id);
        }        
        public int AddPagesMaster(SYS_PAGE_MASTER page)
        {
            try
            {
                _context.SYS_PAGE_MASTER.Add(page);
                return _context.SaveChanges();

            }
            catch (Exception ex)
            {
                var msg = ex.Message;
                return 0;
            }

        }        
        public SYS_PAGE_MASTER SearchPage(string id_role)
        {
            var page = _context.SYS_PAGE_MASTER.Where(w => w.page_id == id_role).FirstOrDefault();
            if (page != null)
                return page;
            else
                return null;
        }      
        public int UpdatePagesMaster(SYS_PAGE_MASTER page)
        {
            _context.Entry(page).State = System.Data.Entity.EntityState.Modified;
            return _context.SaveChanges();
        }        
        public ICollection<SYS_PAGE_MASTER> GetAllPagesOfRole(string rol)
        {
            return _context.SYS_PAGE_MASTER.Where(x => !_context.SYS_ROLE_PAGE.Any(v => v.role_id == rol && x.page_id == v.page_id)).OrderBy(x => x.page_id).ThenByDescending(x => x.page_id).ToList();
        }
       
        public ICollection<SYS_PAGE_MASTER> GetAllPagesAvailable(string rol)
        {
            return _context.SYS_PAGE_MASTER.Where(x => x.SYS_ROLE_PAGE.Any(y => y.role_id == rol)).OrderBy(x => x.page_id).ThenByDescending(x => x.page_id).ToList();
        }
        
        public ICollection<SYS_PAGE_MASTER> GetAllPagesOfUser(string employeeNumber)
        {
            return _context.SYS_PAGE_MASTER.Where(x => x.SYS_ROLE_PAGE.Any(y => y.SYS_ROLE_MASTER.SYS_ROLE_USER.Any(k => k.emp_no == employeeNumber && x.active_flag ==true))).OrderBy(x => x.menu_sequence).ThenBy(x => x.level_2_menu).ThenBy(x => x.level_3_menu).ThenByDescending(x => x.menu_sequence).ToList();
        }
    }
}
