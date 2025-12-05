using App.Entities.ViewModels.Distribution;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DFLPOSUpdater.ViewModels.Distributions
{
    public class DistributionViewModel
    {
        // Distribution data
        public int DistributionId { get; set; }
        public string State { get; set; }      // "OK" or "Error"
        public string Message { get; set; }
        public DateTime CreatedDate { get; set; }

        // Version data
        public int VersionId { get; set; }
        public string VersionName { get; set; }
        public string VersionNumber { get; set; }
        public string VersionDescription { get; set; }
        public string FileName { get; set; }
        public DateTime UploadDate { get; set; }

        // Site data
        public int SiteId { get; set; }
        public string SiteName { get; set; }
        public string SiteIp { get; set; }
        public string DestinationRoute { get; set; }

        public List<DistributionModel> DistributionCurrent { get; set; } 
        // Visual helper for table row color (Bootstrap)
        public string StateCss =>
            State?.Equals("OK", StringComparison.OrdinalIgnoreCase) == true ? "success" : "danger";
    }
}