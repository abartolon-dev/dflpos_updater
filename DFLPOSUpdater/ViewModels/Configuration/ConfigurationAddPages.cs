using App.Entities;
using System;
using System.Collections.Generic;

namespace DFLPOSUpdater.ViewModels.Configuration
{

    public class ConfigurationAddPages
    {

        public string page_id { get; set; }
        public string page_name { get; set; }
        public string description { get; set; }
        public string url { get; set; }
        public Nullable<bool> active_flag { get; set; }
        public Nullable<System.DateTime> cdate { get; set; }
        public string cuser { get; set; }
        public Nullable<System.DateTime> udate { get; set; }
        public string uuser { get; set; }
        public string program_id { get; set; }
        public virtual List<SYS_PAGE_MASTER> Page { get; set; }

        public SYS_PAGE_MASTER PAGES { get { return new SYS_PAGE_MASTER { page_id = page_id, page_name = page_name, description = description, url = url, active_flag = active_flag, cdate = cdate, cuser = cuser, udate = udate, uuser = uuser, program_id = "ADMS001.cshtml" }; } }       


    }
}