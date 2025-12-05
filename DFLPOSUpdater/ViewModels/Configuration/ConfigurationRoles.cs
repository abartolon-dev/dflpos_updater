using System;

namespace DFLPOSUpdater.ViewModels.Configuration
{
    public class ConfigurationRoles
    {
        public string role_id { get; set; }
        public string role_name { get; set; }
        public string role_description { get; set; }
        public Nullable<bool> active_flag { get; set; }
    }
}