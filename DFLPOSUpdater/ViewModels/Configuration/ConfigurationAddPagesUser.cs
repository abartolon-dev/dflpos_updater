using App.BLL.Site;
using App.Entities;
using App.Entities.ViewModels.Site;
using System.Collections.Generic;
using System.Web.Mvc;

namespace DFLPOSUpdater.ViewModels.Configuration
{
    public class ConfigurationAddPagesUser
    {
        public virtual List<MA_CODE> ListDepartment { get; set; }
        public string EmployeeNumber { get; set; }

        public string userName { get; set; }
        public string FullName { get; set; }
        public virtual List<USER_MASTER> Users { get; set; }

        private SiteBusiness _siteConfigBusiness = new SiteBusiness();
        public virtual List<SiteModel> Site { get; set; }

        public IEnumerable<SelectListItem> SiteList
        {
            get
            {
                return FillSelectListSite();
            }
        }
        public List<SelectListItem> FillSelectListSite()
        {
            Site = _siteConfigBusiness.GetAllSitesModel();
            List<SelectListItem> sites = new List<SelectListItem>();
            sites.Add(new SelectListItem { Text = "Seleccione una opción", Value = "" });
            foreach (var n in Site)
            {
                sites.Add(new SelectListItem { Text = n.SiteName, Value = n.SiteCode });
            }
            return sites;
        }
    }
}