using App.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.DAL.Configuration
{
    public class SysSiteRepository
    {
        private DFLSAIEntities _context;
        public SysSiteRepository()
        {
            _context = new DFLSAIEntities();
        }
        public List<SiteViewModel> GetAllSites()
        {
            return _context.SITES.Select(x => new SiteViewModel
            {
                site_code = x.site_code,
                address = x.address,
                ip_address = x.ip_address.Trim()+":"+x.port.Trim(),
                site_name = x.site_name
            }).ToList();
        }
    }
}
