using App.DAL;
using App.Entities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Reflection;

namespace App.BLL.Configuration
{
    public class SysPageMasterBusiness
    {
        private SysPageMasterRepository _PageMasterRepo;

        //constructor
        public SysPageMasterBusiness()
        {
            _PageMasterRepo = new SysPageMasterRepository();
        }
        public List<SYS_PAGE_MASTER> GetAllPagesAdmin()
        {
            return _PageMasterRepo.GetAllPagesAdmin();
        }       
        public SYS_PAGE_MASTER GetPageByID(string page_id)
        {
            return _PageMasterRepo.GetPageByID(page_id);

        }       
        public bool AddPagesMaster(SYS_PAGE_MASTER Page)
        {
            var check = false;
            var flag = _PageMasterRepo.AddPagesMaster(Page);

            if (flag > 0) check = true;

            return check;
        }       
        public SYS_PAGE_MASTER SearchPage(string id_page)
        {
            return _PageMasterRepo.SearchPage(id_page);
        }
       
        public bool UpdatePagesMaster(SYS_PAGE_MASTER Page)
        {
            var check = false;
            if (_PageMasterRepo.UpdatePagesMaster(Page) > 0) check = true;
            return check;
        }
        
        public ICollection<SYS_PAGE_MASTER> GetAllPagesOfRole(string rol)
        {
            return _PageMasterRepo.GetAllPagesOfRole(rol);
        }
        
        public ICollection<SYS_PAGE_MASTER> GetAllPagesAvailable(string rol)
        {
            return _PageMasterRepo.GetAllPagesAvailable(rol);
        }
       
        public DataSet GetAllPagesOfUser(string rol)
        {
            DataSet table = new DataSet();
            DataTable dt = new DataTable();
            try
            {
                var items = _PageMasterRepo.GetAllPagesOfUser(rol);
                dt.Columns.Add("page_id", typeof(string));
                dt.Columns.Add("page_name", typeof(string));
                dt.Columns.Add("description", typeof(string));
                dt.Columns.Add("url", typeof(string));
                dt.Columns.Add("active_flag", typeof(bool));
                dt.Columns.Add("level_1_menu", typeof(string));
                dt.Columns.Add("level_2_menu", typeof(string));
                dt.Columns.Add("level_3_menu", typeof(string));
                dt.Columns.Add("type", typeof(string));
                DataRow row = null;
                foreach (var item in items)
                {
                    row = dt.NewRow();
                    row["page_id"] = item.page_id;
                    row["page_name"] = item.page_name;
                    row["description"] = item.description;
                    row["url"] = item.url;
                    row["active_flag"] = item.active_flag;
                    row["level_1_menu"] = item.level_1_menu;
                    row["level_2_menu"] = item.level_2_menu;
                    row["level_3_menu"] = item.level_3_menu;
                    row["type"] = item.type;
                    dt.Rows.Add(row);
                }
                table.Tables.Add(dt);
            }
            catch (Exception e)
            {
                string g=e.Message;
                return table;
            }
            return table;
        }
    }
}
