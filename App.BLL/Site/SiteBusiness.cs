using App.DAL.Site;
using App.Entities;
using App.Entities.ViewModels.Site;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace App.BLL.Site
{
    public class SiteBusiness
    {
        private SiteRepository _siteRepository;

        //constructor
        public SiteBusiness()
        {
            _siteRepository = new SiteRepository();
        }

        public List<SITES> GetAllSites()
        {
            return _siteRepository.GetAllSites();
        }

        public List<SiteModel> GetAllSitesModel()
        {
            return _siteRepository.GetAllSitesModel();
        }

        public string[] GetAllSitesOfertsArray()
        {
            List<SITES> sites = GetAllSitesOferts();
            return sites.Select(s => s.site_code).ToArray();
        }

        public List<SITES> GetAllSitesOferts()
        {
            //return _siteRepository.GetAllSitesOferts();
            return _siteRepository.GetAllSitesOferts().Where(w => w.new_erp == true).ToList();
        }

        public List<SiteModel> GetAllSitesOfertsViewModel()
        {
            //return _siteRepository.GetAllSitesOfertsViewModel();
            return _siteRepository.GetAllSitesOfertsViewModel().Where(w => w.NewErp == true).ToList();
        }

        public List<SiteModel> GetAllSitesOfertsViewModelByDistrict()
        {
            //return _siteRepository.GetAllSitesOfertsViewModel();
            return _siteRepository.GetAllSitesOfertsViewModel().Where(w => w.NewErp == true && w.District != "D999").ToList();
        }
       

        public List<SiteModel> GetAllCofiSitesByReplacement()
        {
            var sites = GetAllSitesOfertsViewModel();
            foreach (var site in sites)
                site.SiteName = site.SiteName.Replace("FLORIDO", "GERENCIA");
            return sites;
        }
        public List<SiteModel> GetAllSitesName()
        {
            //var sites = _siteRepository.GetAllSitesName();
            return _siteRepository.GetAllSitesName().Where(w => w.NewErp == true).ToList();
        }
        public List<string> GetAllDistricts()
        {
            var all_sites = GetAllSitesOfertsViewModel();
            var districts = all_sites.Select(s => s.District).Distinct().OrderBy(o => o).ToList();
            return districts;
        }

        public List<SiteModel> GetAllDistrictsFullName(bool all_districts)
        {
            List<SiteModel> my_new_districts = new List<SiteModel>();
            var all_sites = GetAllSitesOfertsViewModelByDistrict();
            if(all_districts)
                my_new_districts.Add(new SiteModel { District = "Todos los distritos", SiteName = "Todos los distritos", SiteCode = "D0" });
            else
                my_new_districts.Add(new SiteModel { District = "Seleccione un distrito", SiteName = "Seleccione un distrito", SiteCode = "D0" });
            var districts = all_sites.Select(s => s.District).Distinct().OrderBy(o => o).ToList();
            foreach (string d in districts)
                my_new_districts.Add(new SiteModel { District = "Distrito " + Regex.Match(d, @"\d+").Value, SiteName = "Distrito " + Regex.Match(d, @"\d+").Value, SiteCode = d });
            return my_new_districts;
        }

        public List<SiteModel> GetAllDistrictsFullName(bool all_districts, string select_district)
        {
            List<SiteModel> my_new_districts = new List<SiteModel>();
            var all_sites = GetAllSitesOfertsViewModelByDistrict();
            if (all_districts)
                my_new_districts.Add(new SiteModel { District = "Todos los distritos", SiteName = "Todos los distritos", SiteCode = "D0" });
            else
                my_new_districts.Add(new SiteModel { District = "Seleccione un distrito", SiteName = "Seleccione un distrito", SiteCode = "D0" });

            List<string> districts = all_sites.Select(s => s.District).Distinct().OrderBy(o => o).ToList();

            if(select_district != "")
            {
                StringBuilder builder = new StringBuilder(select_district);
                builder.Replace("'", "");
                select_district = builder.ToString();

                string[] districts_clear = select_district.Split(',');

                districts = districts.Where(w => districts_clear.Contains(w) ).ToList();
            }
            
            foreach (string d in districts)
                my_new_districts.Add(new SiteModel { District = "Distrito " + Regex.Match(d, @"\d+").Value, SiteName = "Distrito " + Regex.Match(d, @"\d+").Value, SiteCode = d });
            return my_new_districts;
        }
        public List<SiteModel> GetAllDistrictsFullNameConcat()
        {
            List<SiteModel> my_new_districts = new List<SiteModel>();
            var all_sites = GetAllSitesOfertsViewModelByDistrict();
            var districts = all_sites.Select(s => s.District).Distinct().OrderBy(o => o).ToList();
            foreach (string d in districts)
                my_new_districts.Add(new SiteModel { District = "Distrito " + Regex.Match(d, @"\d+").Value, SiteName = "Distrito " + Regex.Match(d, @"\d+").Value, SiteCode = d });
            return my_new_districts;
        }

        public List<string[]> GetAllDistrictsFullNameConcatFoodStamps()
        {
            List<string[]> my_new_districts = new List<string[]>();
            var all_sites = GetAllSitesOfertsViewModelByDistrict();
            var districts = all_sites.Select(s => s.District).Distinct().OrderBy(o => o).ToList();

            foreach (string d in districts)
                my_new_districts.Add(new string[] { $"D{Regex.Match(d, @"\d+").Value}", $"Distrito {Regex.Match(d, @"\d+").Value}" });
            
            return my_new_districts;
        }

        public List<SiteModel> GetAllSitesNameAll()
        {
            //var sites = _siteRepository.GetAllSitesName(); //Se agrega a 0094 para 'reportear' en una Vista
            return _siteRepository.GetAllSitesName().Where(w => (w.SiteCode == "0094" || w.SiteCode == "0004") || w.NewErp == true).ToList();
        }

        public List<SiteModel> GetAllSitesNameAllByDistrict( string select_district )
        {
            //var sites = _siteRepository.GetAllSitesName(); //Se agrega a 0094 para 'reportear' en una Vista
            return _siteRepository.GetAllSitesNameByDistrict(select_district).Where(w => (w.SiteCode == "0094" || w.SiteCode == "0004") || w.NewErp == true).ToList();
        }

        public SitesPOModel GetSiteAllInformation(string site_code)
        {
            return _siteRepository.GetSiteAllInformation(site_code);
        }

        public string GetSiteNameByCode(string site_code)
        {
            return _siteRepository.GetSiteNameByCode(site_code);
        }
        public List<SiteModel> GetAllSitesStore()
        {
            var list = _siteRepository.GetAllSitesStore();
            return list;
        }

     
        public string GetSiteIP(string site_code) => _siteRepository.GetSiteIP(site_code);
        public string GetSitePort(string site_code) => _siteRepository.GetSitePort(site_code);
       
        public List<SiteModel> GetAllSitesNameAccAndDistrict()
        {
            var f = new List<SiteModel>();
            var a = GetAllDistrictsFullNameConcat();
           

            f.AddRange(a);
        
            return f;
        }
        public List<SITES> GetAllSitesByDistrict(string site)
        {
            return _siteRepository.GetAllSitesByDistrict(site);
        }

        public List<SiteModel> GetAllSitesNameByDistrit(string dc) => _siteRepository.GetAllSitesNameByDistrit(dc);
       
       
    }
}