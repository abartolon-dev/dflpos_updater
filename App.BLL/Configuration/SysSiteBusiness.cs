using App.DAL.Configuration;
using System.Collections.Generic;

namespace App.BLL.Configuration
{
    public class SysSiteBusiness
    {
        private SysSiteRepository _SiteRepo;
        public SysSiteBusiness()
        {
            _SiteRepo = new SysSiteRepository();
        }
        public List<SiteViewModel> GetAllSites()
        {
            return _SiteRepo.GetAllSites();
        }
    }
}
