using App.Entities;
using System;
using System.Collections.Generic;

namespace DFLPOSUpdater.ViewModels.Configuration
{

    public class ConfigurationAddRoles
    {
        public string role_id { get; set; }
        public string role_name { get; set; }
        public string role_description { get; set; }
        public Nullable<bool> active_flag { get; set; }
        public Nullable<System.DateTime> cdate { get; set; }
        public string cuser { get; set; }
        public Nullable<System.DateTime> udate { get; set; }
        public string uuser { get; set; }
        public virtual ICollection<SYS_ROLE_MASTER> RolesCollection { get; set; }
        public SYS_ROLE_MASTER ROLES { get { return new SYS_ROLE_MASTER { role_id = role_id, role_name = role_name, role_description = role_description, active_flag = active_flag, cdate = cdate, cuser = cuser, udate = udate, uuser = uuser }; } }               
    }
}