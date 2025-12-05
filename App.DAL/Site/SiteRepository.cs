using App.Entities;
using App.Entities.ViewModels.Site;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace App.DAL.Site
{
    public class SiteRepository
    {
        private DFLSAIEntities _context;


        public SiteRepository()
        {
            _context = new DFLSAIEntities();
        }
        public List<SITES> GetAllSites()
        {
            return _context.SITES.Select(x => x).ToList();
        }
        public List<SiteModel> GetAllSitesModel()
        {
            return _context.SITES.Where(x => x.site_type == "TIENDA" && x.site_name != "PROCESADORA").Select(s => new SiteModel { SiteCode = s.site_code, SiteName = s.site_name, NewErp = s.new_erp }).ToList();
        }

        public List<SITES> GetAllSitesOferts()
        {
            return _context.SITES.Select(x => x).Where(x => x.site_type == "TIENDA" && x.site_name != "PROCESADORA").ToList();
        }

        public List<SiteModel> GetAllSitesOfertsViewModel()
        {
            var p = _context.SITES.Where(x => x.site_type == "TIENDA" && x.site_name != "PROCESADORA").Select(s => new SiteModel { SiteCode = s.site_code, SiteName = s.site_name, NewErp = s.new_erp, City = s.city ?? "Todos", District = s.district_code ?? "D999" }).ToList();
            return p;
        }
              
        public List<SiteModel> GetAllSitesName()
        {
            var list = _context.SITES
                .Select(x => new SiteModel
                {
                    SiteName = x.site_name,
                    SiteCode = x.site_code,
                    Status = 0,
                    NewErp = x.new_erp,
                }).ToList();
            return list;
        }
        public List<SiteModel> GetAllSitesNameByDistrict( string select_district )
        {
            if (select_district != "")
            {
                StringBuilder builder = new StringBuilder(select_district);
                builder.Replace("'", "");
                select_district = builder.ToString();

                string[] districts_clear = select_district.Split(',');


                var list = _context.SITES.Where(w => districts_clear.Contains(w.district_code ?? "D999"))
                    .Select(x => new SiteModel
                    {
                        SiteName = x.site_name,
                        SiteCode = x.site_code,
                        Status = 0,
                        NewErp = x.new_erp,
                        District = x.district_code ?? "D999"
                    }).ToList();
                return list;
            } else
            {
                return GetAllSitesName();
            }

        }
        public List<SiteModel> GetAllSitesNameByDistrit(string dc)
        {
            var list = _context.SITES.Where(x => x.district_code == dc)
                .Select(x => new SiteModel
                {
                    SiteName = x.site_name,
                    SiteCode = x.site_code,
                    Status = 0,
                    NewErp = x.new_erp,
                }).ToList();
            return list;
        }
        public List<SITES> GetAllSitesByDistrict(string site)
        {
            var r = _context.SITES.Where(x => x.district_code == site).ToList();
            return r;
        }

        public SitesPOModel GetSiteAllInformation(string site_code)
        {
            return _context.SITES.Where(w => w.site_code == site_code)
                .Select(s => new SitesPOModel
                {
                    SiteName = s.site_name,
                    SitePhone = s.phone,
                    SiteAddress = s.address,
                    SiteCity = s.city,
                    SiteEmail = s.email_manager,
                    SitePostalCode = s.postal_code,
                    SiteState = s.state
                }).SingleOrDefault();
        }

        public string GetSiteNameByCode(string site_code)
        {
            var site = _context.SITES
                .Where(w => w.site_code == site_code)
                .Select(x => new SiteModel
                {
                    SiteName = x.site_name
                }).FirstOrDefault();
            return site.SiteName;
        }
        public List<SiteModel> GetAllSitesStore()
        {
            //return _contextPRT.Database.SqlQuery<SiteModel>(@"select site_code SiteCode , site_name SiteName from sites where site_type = 'TIENDA'").ToList();
            return _context.Database.SqlQuery<SiteModel>(@"select site_code SiteCode , name SiteName from sites where type_site = 'TIENDA'").ToList();
        }
       
        public List<SiteModel> GetAllSitesFloridoExcludeThisSiteNoProcesadora(string siteCode)
        {
            return _context.SITES.Where(x => x.site_type != "COST CENTER" && x.site_code != siteCode)
                .Select(x => new SiteModel
                {
                    SiteCode = x.site_code,
                    SiteName = x.site_name
                }).ToList();
        }

        public string GetSiteIP(string site_code)
        {
            var ip = _context.SITES.Where(w => w.site_code == site_code).FirstOrDefault().ip_address;

            return ip;
        }
        public string GetSitePort(string site_code)
        {
            var port = _context.SITES.Where(w => w.site_code == site_code).FirstOrDefault().port;

            return port??"";
        }        
    }
}