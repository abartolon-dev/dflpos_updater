using App.Entities;
using App.Entities.ViewModels.Site;
using System.Collections.Generic;

namespace DFLPOSUpdater.ViewModels.Sites
{
    public class SitesViewModel
    {
        public List<SITES> Site { get; set; }
        public List<MA_CODE> ListCategory { get; set; }
        public ListSitePosition ListPosition { get; set; }
        public List<SiteModel> Sites { get; set; }
        public List<string> Districts { get; set; }
        public SitesViewModel()
        {
            Site = new List<SITES>();
            ListCategory = new List<MA_CODE>();
            ListPosition = new ListSitePosition();
            Sites = new List<SiteModel>();
            Districts = new List<string>();

        }
    }
}