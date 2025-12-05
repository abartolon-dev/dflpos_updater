using App.Entities;
using App.Entities.ViewModels.Site;
using System.Linq;

namespace App.DAL.Site
{
    public class SiteConfigRepository
    {
        private readonly DFLPOS_UPDATEREntities _context;


        public SiteConfigRepository()
        {
            _context = new DFLPOS_UPDATEREntities();
        }

        public string GetSiteCode()
        {
            var site = _context.SITE_CONFIG.Select(x => new SiteModel
            {
                SiteCode = x.site_code
            }).FirstOrDefault();
            return site.SiteCode;
        }

        public string GetSiteCodeName()
        {
            var site = _context.SITE_CONFIG.Select(x => new SiteConfigModel
            {
                Site = x.site_code,
                SiteName = x.site_name,
                SiteAddress = ""
            }).FirstOrDefault();
            return site.SiteName;
        }

        public SiteConfigModel GetSiteCodeAddress()
        {
            var site = _context.SITE_CONFIG.Select(x => new SiteConfigModel
            {
                Site = x.site_code.Trim(),
                SiteName = x.site_name.Trim(),
                SiteAddress = "",//x.address,
                IP = ""//x.ip_address
            }).FirstOrDefault();
            return site;
        }

        public SiteConfigModel GetSiteConfigInfo()
        {
            var ip = _context.SITE_CONFIG
                .Select(s => new SiteConfigModel
                {
                   IP = "",//s.ip_address.Trim(),
                    User = s.site_user_server,
                    pwd = s.site_user_pwd,
                    Site = s.site_code
                }).FirstOrDefault();
            return ip;
        }

        public SiteConfigModel GetSiteConfig()
        {
            var ip = _context.SITE_CONFIG
                .Select(s => new SiteConfigModel
                {
                    SiteName = s.site_name,
                    Site = s.site_code,
                }).FirstOrDefault();
            return ip;
        }
    }
}