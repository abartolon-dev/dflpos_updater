using System;

namespace DFLPOSUpdater.ViewModels.Configuration
{
    public class ConfigurationPages
    {
        public string page_id { get; set; }
        public string page_name { get; set; }
        public string description { get; set; }
        public string url { get; set; }
        public Nullable<bool> active_flag { get; set; }
    }
}